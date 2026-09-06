# TD SupplyChain DApp — Setup & Deployment Guide

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/TODD43/td-supplychain-dapp.git
cd td-supplychain-dapp
npm install
cd frontend && npm install && cd ..
```

### 2. Local Development (Hardhat Node)

**Terminal 1: Start local blockchain**
```bash
npm run node
```

**Terminal 2: Deploy contract**
```bash
npm run deploy:local
```

Copy the contract address output and update `frontend/.env.local`:
```env
VITE_CONTRACT_ADDRESS=0x<your_contract_address>
VITE_NETWORK_ID=31337
VITE_RPC_URL=http://localhost:8545
```

**Terminal 3: Start frontend**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Set Up MetaMask (Local Testing)

1. Open MetaMask
2. Settings → Networks → Add Network
3. Configure:
   - **Network Name:** Hardhat
   - **RPC URL:** http://localhost:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
4. Import account from Hardhat (first account private key in node output)

---

## Testnet Deployment

### Deploy to Sepolia (Recommended)

**Step 1: Get RPC URL**
- Create free account at [Alchemy](https://www.alchemy.com) or [Infura](https://infura.io)
- Create an Ethereum Sepolia app
- Copy the HTTPS URL

**Step 2: Export private key**
- Export from MetaMask or your wallet
- Save securely (never commit to git)

**Step 3: Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_key  # Optional, for verification
```

**Step 4: Get testnet ETH**
- Visit [Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- Enter your wallet address
- Wait for transaction confirmation

**Step 5: Deploy**
```bash
npm run deploy:sepolia
```

Save the contract address and update `frontend/.env.local`:
```env
VITE_CONTRACT_ADDRESS=0x<deployed_address>
VITE_NETWORK_ID=11155111
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

**Step 6: Update MetaMask to Sepolia**
- Switch to "Sepolia" network in MetaMask
- Ensure you have testnet ETH

**Step 7: Start frontend**
```bash
cd frontend
npm run dev
```

---

### Deploy to Polygon Mumbai

**Step 1: Configure environment**
```env
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_without_0x
```

**Step 2: Get Mumbai testnet MATIC**
- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Select Mumbai
- Enter address and claim tokens

**Step 3: Deploy**
```bash
npm run deploy:mumbai
```

**Step 4: Update MetaMask**
- Add Mumbai network (Chain ID: 80001)
- RPC: https://rpc-mumbai.maticvigil.com
- Currency: MATIC

---

## Running Tests

### Unit Tests
```bash
# Run all tests
npm run test

# Run with watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Wallet connects successfully
- [ ] Contract address loads
- [ ] Can register new asset
- [ ] Can record event for asset
- [ ] Asset details display correctly
- [ ] Provenance timeline shows all events
- [ ] Search finds assets
- [ ] Error handling shows proper messages
- [ ] Responsive on mobile

---

## Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Output is in frontend/dist/
# Deploy frontend to Vercel, Netlify, GitHub Pages, etc.
```

**Important:** Production deployment requires:
1. Audited smart contract
2. Mainnet contract deployment
3. Secure environment variables
4. Proper error monitoring
5. Legal disclaimers

---

## Environment Variables Reference

### Root `.env.local`

```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Polygon Mumbai Testnet
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY

# Deployment Account
PRIVATE_KEY=your_wallet_private_key_here

# Optional: For Etherscan verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Enable gas reporting
REPORT_GAS=true
```

### Frontend `.env.local`

```env
# Deployed Contract Address
VITE_CONTRACT_ADDRESS=0x...

# Network Configuration
VITE_NETWORK_ID=11155111  # 11155111=Sepolia, 80001=Mumbai, 31337=Localhost
VITE_RPC_URL=https://...
```

---

## Verification & Block Explorer Links

### Sepolia
- Block Explorer: https://sepolia.etherscan.io
- View contract: `https://sepolia.etherscan.io/address/0x<contract_address>`
- View transaction: `https://sepolia.etherscan.io/tx/0x<tx_hash>`

### Mumbai
- Block Explorer: https://mumbai.polygonscan.com
- View contract: `https://mumbai.polygonscan.com/address/0x<contract_address>`
- View transaction: `https://mumbai.polygonscan.com/tx/0x<tx_hash>`

---

## Troubleshooting

### "Contract not found at address"
- Verify contract address in `.env.local`
- Check you're on correct network (MetaMask)
- Re-deploy if needed

### "Asset not found"
- Verify asset ID is correct
- Check contract address on correct network
- Asset must be registered before querying

### "Transaction failed"
- Check gas price (may be too high)
- Verify wallet has enough balance
- Check contract is deployed on this network
- Look at error message in console

### "MetaMask connection rejected"
- Unlock MetaMask
- Check browser console for details
- Try refreshing page
- Clear browser cache if persistent

### Contract not compiling
```bash
npm run compile
```

---

## Project Repository

- **GitHub:** https://github.com/TODD43/td-supplychain-dapp
- **Developer:** [@TODD43](https://github.com/TODD43)
- **License:** MIT

---

## Important Security Notice

**⚠️ This is a testnet demonstration project.**

- NOT audited for production
- Use testnet tokens only
- NOT suitable for real assets
- See [SECURITY.md](./SECURITY.md) for full disclaimers

---

For issues or questions, visit the [GitHub repository](https://github.com/TODD43/td-supplychain-dapp).
