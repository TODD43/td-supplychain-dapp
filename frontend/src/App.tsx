import React, { useState, useEffect } from 'react';
import { useWallet } from './context/WalletContext';
import { useSupplyChainContract } from './hooks/useSupplyChainContract';
import { useAssetDetails } from './hooks/useAssetDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import WalletConnect from './components/WalletConnect';
import RegisterAsset from './components/RegisterAsset';
import RecordEvent from './components/RecordEvent';
import SearchAsset from './components/SearchAsset';
import AssetDetails from './components/AssetDetails';
import ProvenanceTimeline from './components/ProvenanceTimeline';
import Alert from './components/Alert';
import './index.css';

type Tab = 'register' | 'record' | 'search' | 'verify';

const App: React.FC = () => {
  const { isConnected } = useWallet();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const contract = useSupplyChainContract(contractAddress);
  
  const [activeTab, setActiveTab] = useState<Tab>('register');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const { asset, history, loading, error: assetError } = useAssetDetails(contract, selectedAssetId);
  
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [isTransacting, setIsTransacting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransaction = async (fn: () => Promise<any>, successMessage: string) => {
    setIsTransacting(true);
    setTransactionError(null);
    try {
      const tx = await fn();
      if (tx?.wait) {
        await tx.wait();
      }
      console.log(successMessage);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction failed';
      setTransactionError(message);
    } finally {
      setIsTransacting(false);
    }
  };

  const handleRegisterAsset = async (id: string, description: string) => {
    if (!contract) return;
    await handleTransaction(
      () => contract.registerAsset(id, description),
      'Asset registered successfully'
    );
  };

  const handleRecordEvent = async (
    eventType: string,
    description: string,
    location: string,
    evidenceHash: string
  ) => {
    if (!contract || !selectedAssetId) return;
    await handleTransaction(
      () => contract.recordEvent(selectedAssetId, eventType, description, location, evidenceHash),
      'Event recorded successfully'
    );
  };

  const handleSearchAsset = async (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveTab('verify');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Header>
        <WalletConnect />
      </Header>

      <main className="flex-1 container py-8">
        {!isConnected ? (
          <div className="card text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Welcome to TD SupplyChain</h2>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              A decentralized blockchain provenance system for tracking and verifying assets throughout their lifecycle.
            </p>
            <div className="bg-slate-700 rounded-lg p-4 text-left text-sm mb-6 max-w-md mx-auto">
              <p className="font-semibold mb-2 text-yellow-400">⚠️ Testnet Only</p>
              <p className="text-slate-300">
                This DApp is designed for testnet environments (Sepolia, Mumbai). It has not been audited for production use. See{' '}
                <a
                  href="https://github.com/TODD43/td-supplychain-dapp/blob/main/SECURITY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  SECURITY.md
                </a>
                {' '}for details.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700 flex-wrap">
              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Register Asset
              </button>
              <button
                onClick={() => setActiveTab('record')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'record'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Record Event
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'verify'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Verify Asset
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'register' && (
              <RegisterAsset
                onRegister={handleRegisterAsset}
                isLoading={isTransacting}
                error={transactionError}
                onErrorDismiss={() => setTransactionError(null)}
              />
            )}

            {activeTab === 'record' && selectedAssetId ? (
              <RecordEvent
                assetId={selectedAssetId}
                onRecord={handleRecordEvent}
                isLoading={isTransacting}
                error={transactionError}
                onErrorDismiss={() => setTransactionError(null)}
              />
            ) : activeTab === 'record' ? (
              <Alert type="info" message="Please search for an asset first to record events" />
            ) : null}

            {activeTab === 'search' && (
              <SearchAsset
                onSearch={handleSearchAsset}
                isLoading={isTransacting}
                error={transactionError}
                onErrorDismiss={() => setTransactionError(null)}
              />
            )}

            {activeTab === 'verify' && (
              <div className="space-y-6">
                {selectedAssetId && !contractAddress && (
                  <Alert
                    type="error"
                    message="Contract address not configured. Please set VITE_CONTRACT_ADDRESS in .env.local"
                  />
                )}

                {selectedAssetId && (
                  <>
                    <AssetDetails asset={asset} loading={loading} error={assetError} />
                    <ProvenanceTimeline events={history} loading={loading} />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
