import React from 'react';
import { formatDate, formatAddress, truncateHash, getIpfsUrl } from '../utils/formatting';
import { ProvenanceEvent } from '../hooks/useAssetDetails';

interface ProvenanceTimelineProps {
  events: ProvenanceEvent[];
  loading: boolean;
}

const ProvenanceTimeline: React.FC<ProvenanceTimelineProps> = ({ events, loading }) => {
  if (loading) {
    return <div className="text-center py-8"><div className="spinner mx-auto"></div></div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-8 text-slate-400">No events recorded yet</div>;
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6">Provenance Timeline</h3>
      <div className="timeline">
        {events.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-blue-400">{event.eventType}</h4>
                <p className="text-sm text-slate-300">{event.description}</p>
                <p className="text-xs text-slate-400 mt-2">
                  📍 {event.location}
                </p>
                {event.evidenceHash && (
                  <p className="text-xs text-slate-400 mt-1">
                    🔗 Evidence:{' '}
                    {event.evidenceHash.startsWith('Qm') ? (
                      <a
                        href={getIpfsUrl(event.evidenceHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {truncateHash(event.evidenceHash)}
                      </a>
                    ) : (
                      <span className="font-mono">{truncateHash(event.evidenceHash)}</span>
                    )}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-slate-400">{formatDate(event.timestamp)}</p>
                <p className="text-xs text-slate-500 mt-2">
                  by {formatAddress(event.recorder)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvenanceTimeline;
