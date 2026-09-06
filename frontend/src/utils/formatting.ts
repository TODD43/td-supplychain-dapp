import { ethers } from 'ethers';

export const formatAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

export const isValidAssetId = (id: string): boolean => {
  return id.length > 0 && id.length <= 50;
};

export const truncateHash = (hash: string, length: number = 12): string => {
  if (!hash) return '';
  return hash.length > length ? `${hash.substring(0, length)}...` : hash;
};

export const getIpfsUrl = (hash: string): string => {
  if (!hash || !hash.startsWith('Qm')) return hash;
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};
