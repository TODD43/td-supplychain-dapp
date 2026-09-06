import React, { useState } from 'react';
import Alert from './Alert';

interface SearchAssetProps {
  onSearch: (assetId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

const SearchAsset: React.FC<SearchAssetProps> = ({
  onSearch,
  isLoading,
  error,
  onErrorDismiss,
}) => {
  const [assetId, setAssetId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) return;
    await onSearch(assetId);
  };

  return (
    <div className="card">
      {error && <Alert type="error" message={error} onClose={onErrorDismiss} />}

      <h2 className="text-2xl font-bold mb-6">Search Asset</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          placeholder="Enter asset ID (e.g., SKU-2024-001)"
          className="input flex-1"
          disabled={isLoading}
          maxLength={50}
        />
        <button
          type="submit"
          disabled={isLoading || !assetId}
          className="btn btn-primary"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchAsset;
