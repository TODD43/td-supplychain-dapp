import { useWallet } from '../context/WalletContext';
import { Contract, BrowserProvider } from 'ethers';
import { useEffect, useState } from 'react';

const SUPPLY_CHAIN_ABI = [
  'function registerAsset(string id, string description) external',
  'function recordEvent(string assetId, string eventType, string description, string location, string evidenceHash) external',
  'function updateStatus(string assetId, string newStatus) external',
  'function updateLocation(string assetId, string newLocation) external',
  'function setRecorderPermission(string assetId, address recorder, bool allowed) external',
  'function deactivateAsset(string assetId) external',
  'function getAsset(string assetId) external view returns (tuple(string, address, string, uint256, string, string, bool))',
  'function getAssetHistory(string assetId) external view returns (tuple(uint256, string, string, string, string, address)[])',
  'function getEventCount(string assetId) external view returns (uint256)',
  'function getEvent(string assetId, uint256 index) external view returns (tuple(uint256, string, string, string, string, address))',
  'function hasRecorderAccess(string assetId, address recorder) external view returns (bool)',
  'function assetExists(string assetId) external view returns (bool)',
  'function getAssetCount() external view returns (uint256)',
  'function getAssetIdAt(uint256 index) external view returns (string)',
];

export const useSupplyChainContract = (contractAddress: string | undefined) => {
  const { provider, account } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (provider && contractAddress && account) {
      const signer = provider.getSigner();
      const sc = new Contract(contractAddress, SUPPLY_CHAIN_ABI, signer);
      setContract(sc);
    }
  }, [provider, contractAddress, account]);

  return contract;
};
