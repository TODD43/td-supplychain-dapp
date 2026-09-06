import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatAddress } from '../utils/formatting';

const WalletConnect: React.FC = () => {
  const { account, isConnected, connect, disconnect, balance, chainId } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } finally {
      setIsConnecting(false);
    }
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 1:
        return 'Mainnet';
      case 11155111:
        return 'Sepolia';
      case 80001:
        return 'Mumbai';
      case 31337:
        return 'Localhost';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <>
          <div className="text-sm text-slate-300">
            <p className="font-medium">{formatAddress(account)}</p>
            <p className="text-slate-400">{getNetworkName()} • {parseFloat(balance).toFixed(2)} ETH</p>
          </div>
          <button onClick={disconnect} className="btn btn-secondary text-sm">
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="btn btn-primary"
        >
          {isConnecting ? (
            <>
              <span className="spinner mr-2"></span>
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
