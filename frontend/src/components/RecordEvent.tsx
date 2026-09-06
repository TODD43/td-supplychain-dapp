import React, { useState } from 'react';
import Alert from './Alert';

interface RecordEventProps {
  assetId: string;
  onRecord: (eventType: string, description: string, location: string, evidenceHash: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

const RecordEvent: React.FC<RecordEventProps> = ({
  assetId,
  onRecord,
  isLoading,
  error,
  onErrorDismiss,
}) => {
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [evidenceHash, setEvidenceHash] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType || !description || !location) return;
    await onRecord(eventType, description, location, evidenceHash);
    setEventType('');
    setDescription('');
    setLocation('');
    setEvidenceHash('');
  };

  return (
    <div className="card">
      {error && <Alert type="error" message={error} onClose={onErrorDismiss} />}

      <h2 className="text-2xl font-bold mb-2">Record Event</h2>
      <p className="text-slate-400 mb-6">Asset ID: <span className="font-mono text-blue-400">{assetId}</span></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="input"
            disabled={isLoading}
          >
            <option value="">Select event type...</option>
            <option value="Manufactured">Manufactured</option>
            <option value="Processed">Processed</option>
            <option value="Packaged">Packaged</option>
            <option value="Shipped">Shipped</option>
            <option value="In Transit">In Transit</option>
            <option value="Received">Received</option>
            <option value="Inspected">Inspected</option>
            <option value="Certified">Certified</option>
            <option value="Verified">Verified</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened"
            className="input min-h-20"
            disabled={isLoading}
            maxLength={500}
          />
          <p className="text-xs text-slate-400 mt-1">{description.length}/500 characters</p>
        </div>

        <div>
          <label className="label">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Farm, Addis Ababa, Ethiopia"
            className="input"
            disabled={isLoading}
            maxLength={200}
          />
          <p className="text-xs text-slate-400 mt-1">{location.length}/200 characters</p>
        </div>

        <div>
          <label className="label">Evidence Hash (IPFS CID or SHA256)</label>
          <input
            type="text"
            value={evidenceHash}
            onChange={(e) => setEvidenceHash(e.target.value)}
            placeholder="e.g., QmXx... or 0x..."
            className="input"
            disabled={isLoading}
            maxLength={100}
          />
          <p className="text-xs text-slate-400 mt-1">{evidenceHash.length}/100 characters (optional)</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !eventType || !description || !location}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Recording Event...' : 'Record Event'}
        </button>
      </form>
    </div>
  );
};

export default RecordEvent;
