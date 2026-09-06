import React from 'react';
import { formatAddress, formatDate } from '../utils/formatting';
import { AssetData } from '../hooks/useAssetDetails';

interface AssetDetailsProps {
  asset: AssetData | null;
  loading: boolean;
  error: string | null;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset, loading, error }) => {
  if (loading) {
    return <div className="text-center py-8"><div className="spinner mx-auto"></div></div>;
  }

  if (error) {
    return <div className="card bg-red-900 border-red-700 text-red-100">Error: {error}</div>;
  }

  if (!asset) {
    return <div className="card text-slate-400">Asset not found</div>;
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-400 mb-2">{asset.id}</h2>
        <p className="text-slate-300">{asset.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-700 pt-6">
        <div>
          <p className="text-slate-400 text-sm">Current Status</p>
          <p className="text-lg font-semibold text-green-400">{asset.currentStatus}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Current Location</p>
          <p className="text-lg font-semibold text-yellow-400">
            {asset.currentLocation || 'Not set'}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Registered</p>
          <p className="text-sm font-mono">{formatDate(asset.createdAt)}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Creator</p>
          <p className="text-sm font-mono">{formatAddress(asset.creator)}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Status</p>
          <p className="text-sm">
            {asset.isActive ? (
              <span className="text-green-400 font-semibold">✓ Active</span>
            ) : (
              <span className="text-red-400 font-semibold">✗ Inactive</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
