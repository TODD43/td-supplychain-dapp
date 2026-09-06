// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SupplyChain
 * @dev A decentralized provenance and asset tracking system
 * WARNING: This contract is for testnet/educational use only and has not been audited.
 */
contract SupplyChain {
    // Asset structure
    struct Asset {
        string id;                    // Unique asset identifier
        address creator;              // Who registered the asset
        string description;           // Asset description
        uint256 createdAt;           // Registration timestamp
        string currentStatus;         // Current status
        string currentLocation;       // Current location
        bool isActive;               // Is asset still active?
    }

    // Provenance event structure
    struct ProvenanceEvent {
        uint256 timestamp;           // When event occurred
        string eventType;            // Event type (e.g., "manufactured", "shipped")
        string description;          // Event description
        string location;             // Location where event occurred
        string evidenceHash;         // IPFS hash or document hash
        address recorder;            // Who recorded this event
    }

    // State variables
    mapping(string => Asset) public assets;
    mapping(string => ProvenanceEvent[]) public assetHistory;
    mapping(string => mapping(address => bool)) public recorders; // Asset-specific recorder permissions
    mapping(string => bool) private _assetExists;
    
    address public owner;
    string[] private assetIds;

    // Events
    event AssetRegistered(
        string indexed assetId,
        address indexed creator,
        string description,
        uint256 timestamp
    );

    event EventRecorded(
        string indexed assetId,
        string eventType,
        string location,
        address indexed recorder,
        uint256 timestamp
    );

    event StatusUpdated(
        string indexed assetId,
        string newStatus,
        uint256 timestamp
    );

    event LocationUpdated(
        string indexed assetId,
        string newLocation,
        uint256 timestamp
    );

    event RecorderPermissionGranted(
        string indexed assetId,
        address indexed recorder,
        uint256 timestamp
    );

    event RecorderPermissionRevoked(
        string indexed assetId,
        address indexed recorder,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyAssetCreator(string memory assetId) {
        require(assets[assetId].creator == msg.sender, "Only asset creator can perform this action");
        _;
    }

    modifier onlyAuthorizedRecorder(string memory assetId) {
        require(
            assets[assetId].creator == msg.sender || recorders[assetId][msg.sender],
            "Not authorized to record events for this asset"
        );
        _;
    }

    modifier assetMustExist(string memory assetId) {
        require(_assetExists[assetId], "Asset does not exist");
        _;
    }

    modifier validString(string memory str) {
        require(bytes(str).length > 0, "String cannot be empty");
        require(bytes(str).length <= 500, "String too long");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new asset
     * @param assetId Unique identifier for the asset
     * @param description Description of the asset
     */
    function registerAsset(
        string memory assetId,
        string memory description
    ) external validString(assetId) validString(description) {
        require(!_assetExists[assetId], "Asset with this ID already exists");
        require(bytes(assetId).length <= 50, "Asset ID too long");

        assets[assetId] = Asset({
            id: assetId,
            creator: msg.sender,
            description: description,
            createdAt: block.timestamp,
            currentStatus: "Registered",
            currentLocation: "",
            isActive: true
        });

        _assetExists[assetId] = true;
        assetIds.push(assetId);

        // Grant creator automatic recorder permission
        recorders[assetId][msg.sender] = true;

        emit AssetRegistered(assetId, msg.sender, description, block.timestamp);
    }

    /**
     * @dev Record a provenance event for an asset
     * @param assetId ID of the asset
     * @param eventType Type of event (e.g., "manufactured", "shipped")
     * @param description Description of the event
     * @param location Where the event occurred
     * @param evidenceHash IPFS hash or document hash for evidence
     */
    function recordEvent(
        string memory assetId,
        string memory eventType,
        string memory description,
        string memory location,
        string memory evidenceHash
    )
        external
        assetMustExist(assetId)
        onlyAuthorizedRecorder(assetId)
        validString(eventType)
        validString(description)
    {
        require(assets[assetId].isActive, "Asset is not active");
        require(bytes(location).length <= 200, "Location string too long");
        require(bytes(evidenceHash).length <= 100, "Evidence hash too long");

        ProvenanceEvent memory newEvent = ProvenanceEvent({
            timestamp: block.timestamp,
            eventType: eventType,
            description: description,
            location: location,
            evidenceHash: evidenceHash,
            recorder: msg.sender
        });

        assetHistory[assetId].push(newEvent);

        emit EventRecorded(assetId, eventType, location, msg.sender, block.timestamp);
    }

    /**
     * @dev Update the current status of an asset
     * @param assetId ID of the asset
     * @param newStatus New status string
     */
    function updateStatus(
        string memory assetId,
        string memory newStatus
    ) external assetMustExist(assetId) onlyAssetCreator(assetId) validString(newStatus) {
        require(bytes(newStatus).length <= 100, "Status string too long");
        assets[assetId].currentStatus = newStatus;
        emit StatusUpdated(assetId, newStatus, block.timestamp);
    }

    /**
     * @dev Update the current location of an asset
     * @param assetId ID of the asset
     * @param newLocation New location string
     */
    function updateLocation(
        string memory assetId,
        string memory newLocation
    ) external assetMustExist(assetId) onlyAssetCreator(assetId) validString(newLocation) {
        require(bytes(newLocation).length <= 200, "Location string too long");
        assets[assetId].currentLocation = newLocation;
        emit LocationUpdated(assetId, newLocation, block.timestamp);
    }

    /**
     * @dev Grant recorder permission for an asset
     * @param assetId ID of the asset
     * @param recorderAddress Address to grant permission to
     */
    function setRecorderPermission(
        string memory assetId,
        address recorderAddress,
        bool allowed
    ) external assetMustExist(assetId) onlyAssetCreator(assetId) {
        require(recorderAddress != address(0), "Invalid address");
        recorders[assetId][recorderAddress] = allowed;

        if (allowed) {
            emit RecorderPermissionGranted(assetId, recorderAddress, block.timestamp);
        } else {
            emit RecorderPermissionRevoked(assetId, recorderAddress, block.timestamp);
        }
    }

    /**
     * @dev Deactivate an asset
     * @param assetId ID of the asset
     */
    function deactivateAsset(
        string memory assetId
    ) external assetMustExist(assetId) onlyAssetCreator(assetId) {
        assets[assetId].isActive = false;
    }

    /**
     * @dev Check if an asset exists
     * @param assetId ID to check
     * @return True if asset exists
     */
    function assetExists(string memory assetId) external view returns (bool) {
        return _assetExists[assetId];
    }

    /**
     * @dev Get asset details
     * @param assetId ID of the asset
     * @return The asset struct
     */
    function getAsset(string memory assetId)
        external
        view
        assetMustExist(assetId)
        returns (Asset memory)
    {
        return assets[assetId];
    }

    /**
     * @dev Get all events for an asset
     * @param assetId ID of the asset
     * @return Array of provenance events
     */
    function getAssetHistory(string memory assetId)
        external
        view
        assetMustExist(assetId)
        returns (ProvenanceEvent[] memory)
    {
        return assetHistory[assetId];
    }

    /**
     * @dev Get count of events for an asset
     * @param assetId ID of the asset
     * @return Number of events
     */
    function getEventCount(string memory assetId)
        external
        view
        assetMustExist(assetId)
        returns (uint256)
    {
        return assetHistory[assetId].length;
    }

    /**
     * @dev Get a specific event for an asset
     * @param assetId ID of the asset
     * @param eventIndex Index of the event
     * @return The provenance event
     */
    function getEvent(
        string memory assetId,
        uint256 eventIndex
    ) external view assetMustExist(assetId) returns (ProvenanceEvent memory) {
        require(eventIndex < assetHistory[assetId].length, "Event index out of bounds");
        return assetHistory[assetId][eventIndex];
    }

    /**
     * @dev Check if an address has recorder permission for an asset
     * @param assetId ID of the asset
     * @param recorderAddress Address to check
     * @return True if authorized
     */
    function hasRecorderAccess(
        string memory assetId,
        address recorderAddress
    ) external view assetMustExist(assetId) returns (bool) {
        return recorders[assetId][recorderAddress] || assets[assetId].creator == recorderAddress;
    }

    /**
     * @dev Get total number of registered assets
     * @return Number of assets
     */
    function getAssetCount() external view returns (uint256) {
        return assetIds.length;
    }

    /**
     * @dev Get asset ID at a specific index
     * @param index Index in the array
     * @return Asset ID
     */
    function getAssetIdAt(uint256 index) external view returns (string memory) {
        require(index < assetIds.length, "Index out of bounds");
        return assetIds[index];
    }
}
