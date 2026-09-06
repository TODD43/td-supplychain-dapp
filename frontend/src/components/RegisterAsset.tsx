import React, { useState } from 'react';
import Alert from './Alert';

interface RegisterAssetProps {
  onRegister: (id: string, description: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

const RegisterAsset: React.FC<RegisterAssetProps> = ({
  onRegister,
  isLoading,
  error,
  onErrorDismiss,
}) => {
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !description) return;
    await onRegister(assetId, description);
    setAssetId('');
    setDescription('');
  };

  return (
    <div className="card">
      {error && <Alert type="error" message={error} onClose={onErrorDismiss} />}

      <h2 className="text-2xl font-bold mb-6">Register Asset</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Asset ID</label>
          <input
            type="text"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="e.g., SKU-2024-001"
            className="input"
            disabled={isLoading}
            maxLength={50}
          />
          <p className="text-xs text-slate-400 mt-1">{assetId.length}/50 characters</p>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the asset (product, batch, shipment, etc.)"
            className="input min-h-24"
            disabled={isLoading}
            maxLength={500}
          />
          <p className="text-xs text-slate-400 mt-1">{description.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !assetId || !description}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Registering...' : 'Register Asset'}
        </button>
      </form>
    </div>
  );
};

export default RegisterAsset;
