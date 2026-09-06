import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
  balance: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (provider && account) {
      provider.getBalance(account).then((bal) => {
        setBalance(ethers.formatEther(bal));
      });
    }
  }, [provider, account]);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setBalance('0');
  };

  return (
    <WalletContext.Provider value={{ account, isConnected: !!account, provider, connect, disconnect, chainId, balance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
