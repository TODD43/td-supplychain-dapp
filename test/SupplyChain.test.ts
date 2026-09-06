import { expect } from "chai";
import { ethers } from "hardhat";
import { SupplyChain } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SupplyChain", function () {
  let supplyChain: SupplyChain;
  let owner: SignerWithAddress;
  let recorder: SignerWithAddress;
  let other: SignerWithAddress;

  const ASSET_ID = "SKU-2024-001";
  const ASSET_DESC = "Ethiopian Coffee Beans";
  const EVENT_TYPE = "Harvested";
  const LOCATION = "Farm, Addis Ababa, Ethiopia";
  const EVIDENCE_HASH = "QmXxxx...";

  beforeEach(async function () {
    [owner, recorder, other] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();
  });

  describe("Asset Registration", function () {
    it("Should register a new asset", async function () {
      await expect(supplyChain.registerAsset(ASSET_ID, ASSET_DESC))
        .to.emit(supplyChain, "AssetRegistered")
        .withArgs(ASSET_ID, owner.address, ASSET_DESC);

      const asset = await supplyChain.getAsset(ASSET_ID);
      expect(asset.id).to.equal(ASSET_ID);
      expect(asset.description).to.equal(ASSET_DESC);
      expect(asset.creator).to.equal(owner.address);
      expect(asset.currentStatus).to.equal("Registered");
      expect(asset.isActive).to.be.true;
    });

    it("Should prevent duplicate asset IDs", async function () {
      await supplyChain.registerAsset(ASSET_ID, ASSET_DESC);
      await expect(supplyChain.registerAsset(ASSET_ID, ASSET_DESC)).to.be.revertedWith(
        "Asset with this ID already exists"
      );
    });

    it("Should prevent empty asset ID", async function () {
      await expect(supplyChain.registerAsset("", ASSET_DESC)).to.be.revertedWith(
        "String cannot be empty"
      );
    });

    it("Should grant creator recorder permission", async function () {
      await supplyChain.registerAsset(ASSET_ID, ASSET_DESC);
      const hasAccess = await supplyChain.hasRecorderAccess(ASSET_ID, owner.address);
      expect(hasAccess).to.be.true;
    });
  });

  describe("Event Recording", function () {
    beforeEach(async function () {
      await supplyChain.registerAsset(ASSET_ID, ASSET_DESC);
    });

    it("Should record a provenance event", async function () {
      await expect(
        supplyChain.recordEvent(ASSET_ID, EVENT_TYPE, "Event details", LOCATION, EVIDENCE_HASH)
      )
        .to.emit(supplyChain, "EventRecorded")
        .withArgs(ASSET_ID, EVENT_TYPE, LOCATION, owner.address);

      const eventCount = await supplyChain.getEventCount(ASSET_ID);
      expect(eventCount).to.equal(1);

      const event = await supplyChain.getEvent(ASSET_ID, 0);
      expect(event.eventType).to.equal(EVENT_TYPE);
      expect(event.location).to.equal(LOCATION);
      expect(event.recorder).to.equal(owner.address);
    });

    it("Should prevent unauthorized recorder", async function () {
      await expect(
        supplyChain
          .connect(other)
          .recordEvent(ASSET_ID, EVENT_TYPE, "Details", LOCATION, EVIDENCE_HASH)
      ).to.be.revertedWith("Not authorized to record events for this asset");
    });

    it("Should allow authorized recorder", async function () {
      await supplyChain.setRecorderPermission(ASSET_ID, recorder.address, true);

      await expect(
        supplyChain
          .connect(recorder)
          .recordEvent(ASSET_ID, EVENT_TYPE, "Details", LOCATION, EVIDENCE_HASH)
      ).to.emit(supplyChain, "EventRecorded");
    });

    it("Should prevent recording on inactive asset", async function () {
      await supplyChain.deactivateAsset(ASSET_ID);
      await expect(
        supplyChain.recordEvent(ASSET_ID, EVENT_TYPE, "Details", LOCATION, EVIDENCE_HASH)
      ).to.be.revertedWith("Asset is not active");
    });
  });

  describe("Status and Location Updates", function () {
    beforeEach(async function () {
      await supplyChain.registerAsset(ASSET_ID, ASSET_DESC);
    });

    it("Should update asset status", async function () {
      const newStatus = "In Transit";
      await expect(supplyChain.updateStatus(ASSET_ID, newStatus))
        .to.emit(supplyChain, "StatusUpdated")
        .withArgs(ASSET_ID, newStatus);

      const asset = await supplyChain.getAsset(ASSET_ID);
      expect(asset.currentStatus).to.equal(newStatus);
    });

    it("Should update asset location", async function () {
      const newLocation = "Port of Hamburg";
      await expect(supplyChain.updateLocation(ASSET_ID, newLocation))
        .to.emit(supplyChain, "LocationUpdated")
        .withArgs(ASSET_ID, newLocation);

      const asset = await supplyChain.getAsset(ASSET_ID);
      expect(asset.currentLocation).to.equal(newLocation);
    });

    it("Should prevent non-creator from updating status", async function () {
      await expect(
        supplyChain.connect(other).updateStatus(ASSET_ID, "New Status")
      ).to.be.revertedWith("Only asset creator can perform this action");
    });
  });

  describe("Recorder Permissions", function () {
    beforeEach(async function () {
      await supplyChain.registerAsset(ASSET_ID, ASSET_DESC);
    });

    it("Should grant recorder permission", async function () {
      await expect(supplyChain.setRecorderPermission(ASSET_ID, recorder.address, true))
        .to.emit(supplyChain, "RecorderPermissionGranted")
        .withArgs(ASSET_ID, recorder.address);

      const hasAccess = await supplyChain.hasRecorderAccess(ASSET_ID, recorder.address);
      expect(hasAccess).to.be.true;
    });

    it("Should revoke recorder permission", async function () {
      await supplyChain.setRecorderPermission(ASSET_ID, recorder.address, true);
      await expect(supplyChain.setRecorderPermission(ASSET_ID, recorder.address, false))
        .to.emit(supplyChain, "RecorderPermissionRevoked");

      const hasAccess = await supplyChain.hasRecorderAccess(ASSET_ID, recorder.address);
      expect(hasAccess).to.be.false;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await supplyChain.registerAsset(ASSET_ID, ASSET_DESC);
      await supplyChain.recordEvent(ASSET_ID, EVENT_TYPE, "Details", LOCATION, EVIDENCE_HASH);
    });

    it("Should check if asset exists", async function () {
      expect(await supplyChain.assetExists(ASSET_ID)).to.be.true;
      expect(await supplyChain.assetExists("NONEXISTENT")).to.be.false;
    });

    it("Should get asset count", async function () {
      const count = await supplyChain.getAssetCount();
      expect(count).to.equal(1);
    });

    it("Should get asset history", async function () {
      const history = await supplyChain.getAssetHistory(ASSET_ID);
      expect(history.length).to.equal(1);
      expect(history[0].eventType).to.equal(EVENT_TYPE);
    });
  });
});
