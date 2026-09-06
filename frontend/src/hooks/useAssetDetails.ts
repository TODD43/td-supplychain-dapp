import { useWallet } from '../context/WalletContext';
import { useEffect, useState } from 'react';

export interface AssetData {
  id: string;
  creator: string;
  description: string;
  createdAt: number;
  currentStatus: string;
  currentLocation: string;
  isActive: boolean;
}

export interface ProvenanceEvent {
  timestamp: number;
  eventType: string;
  description: string;
  location: string;
  evidenceHash: string;
  recorder: string;
}

interface AssetDetails {
  asset: AssetData | null;
  history: ProvenanceEvent[];
  loading: boolean;
  error: string | null;
}

export const useAssetDetails = (contract: any | null, assetId: string | null, refreshTrigger: number = 0) => {
  const [data, setData] = useState<AssetDetails>({
    asset: null,
    history: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !assetId) return;

      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));
        const [asset, history] = await Promise.all([
          contract.getAsset(assetId),
          contract.getAssetHistory(assetId),
        ]);

        setData({
          asset: {
            id: asset[0],
            creator: asset[1],
            description: asset[2],
            createdAt: Number(asset[3]),
            currentStatus: asset[4],
            currentLocation: asset[5],
            isActive: asset[6],
          },
          history: history.map((event: any) => ({
            timestamp: Number(event[0]),
            eventType: event[1],
            description: event[2],
            location: event[3],
            evidenceHash: event[4],
            recorder: event[5],
          })),
          loading: false,
          error: null,
        });
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch asset data',
        }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [contract, assetId, refreshTrigger]);

  return data;
};
