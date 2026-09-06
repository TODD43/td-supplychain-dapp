# TD SupplyChain — Blockchain Provenance & Real-World Asset Tracking DApp

> An independent blockchain provenance concept that combines elements inspired by supply-chain transparency and real-world asset verification systems.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

TD SupplyChain is a decentralized provenance system that enables organizations to record, verify, and audit the complete lifecycle of physical and digital assets on the blockchain. Users can register assets, record events throughout their lifecycle, track location changes, and store evidence hashes—creating an immutable, transparent record suitable for supply chain, real estate, asset management, and verification use cases.

**⚠️ This is a portfolio/testnet demonstration project and has NOT been independently audited for production use. See [SECURITY.md](./SECURITY.md) for important disclaimers.**

### The Problem

Traditional supply chains and asset management systems suffer from:
- **Opacity**: Limited visibility into product origins and handling
- **Fragmentation**: Multiple disconnected systems across stakeholders
- **Counterfeits**: Difficulty verifying authentic provenance
- **Trust Gaps**: Manual records are easily falsified
- **Inefficiency**: Time-consuming audits and verification processes

### The Solution

TD SupplyChain creates an immutable, decentralized record of asset provenance by:
- Recording lifecycle events on-chain
- Storing cryptographic evidence hashes
- Enabling public verification without central authority
- Providing real-time access to asset history
- Maintaining clear authorization and timestamping

## Key Features

- 🔗 **Blockchain Provenance** — Immutable, timestamped lifecycle records
- 📦 **Asset Registration** — Create unique, traceable asset identifiers
- 📍 **Location Tracking** — Record geographic and facility movements
- 📋 **Event Recording** — Document all significant state changes
- 🔐 **Evidence Hashing** — Store document/media fingerprints
- 🔍 **Public Verification** — Anyone can verify asset authenticity
- 👤 **Authorized Recorders** — Controlled access for data integrity
- ⏰ **Timestamped Events** — Cryptographic proof of when events occurred
- 💼 **Professional UI** — Responsive, intuitive dashboard
- 📱 **Mobile Ready** — Works seamlessly on all devices

## Architecture

### High-Level Flow

```
Asset Owner/Stakeholder
        ↓
    Frontend UI (React)
        ↓
  Wallet Connection (MetaMask)
        ↓
  Smart Contract (Solidity)
        ↓
  Blockchain Network (Sepolia/Mumbai/Local)
        ↓
  Immutable Provenance Record
        ↓
  Public Verification Available to Anyone
```

## Tech Stack

### Smart Contracts
- **Language:** Solidity 0.8.20+
- **Framework:** Hardhat
- **Testing:** Hardhat Test Suite
- **Security:** OpenZeppelin libraries (where applicable)

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Web3 Library:** ethers.js v6
- **Styling:** Tailwind CSS
- **State Management:** React Context API

### Deployment
- **Networks:** Sepolia, Polygon Mumbai, Localhost
- **Package Manager:** npm
- **Version Control:** Git/GitHub

## Project Structure

```
td-supplychain-dapp/
├── contracts/              # Solidity smart contracts
│   └── SupplyChain.sol    # Main provenance contract
├── frontend/              # React web application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React Context providers
│   │   ├── types/         # TypeScript definitions
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main component
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── scripts/               # Deployment & utility scripts
│   └── deploy.ts          # Contract deployment
├── test/                  # Contract tests
│   └── SupplyChain.test.ts
├── hardhat.config.ts      # Hardhat configuration
├── package.json           # Root dependencies
├── tsconfig.json          # TypeScript config
├── .env.example           # Environment template
├── README.md              # This file
├── SECURITY.md            # Security & disclaimers
├── LICENSE                # MIT License
└── .gitignore             # Git ignore rules
```

## Smart Contract: SupplyChain.sol

### Overview

The SupplyChain contract maintains a decentralized registry of assets and their provenance records.

### Key Data Structures

**Asset:**
```solidity
struct Asset {
    string id;                    // Unique identifier
    address creator;              // Who registered it
    string description;           // Asset description
    uint256 createdAt;           // Creation timestamp
    string currentStatus;         // Current status
    string currentLocation;       // Current location
    bool isActive;               // Is asset active?
}
```

**ProvenanceEvent:**
```solidity
struct ProvenanceEvent {
    uint256 timestamp;           // When it happened
    string eventType;            // e.g., "manufactured", "shipped", "received"
    string description;          // Details
    string location;             // Where it happened
    string evidenceHash;         // IPFS/document hash
    address recorder;            // Who recorded it
}
```

### Key Functions

**Registration:**
- `registerAsset(string id, string description)` — Create new asset

**Recording Events:**
- `recordEvent(string assetId, string eventType, string description, string location, string evidenceHash)` — Add provenance event

**Status Updates:**
- `updateStatus(string assetId, string newStatus)` — Update current status
- `updateLocation(string assetId, string newLocation)` — Record location change

**Querying:**
- `getAsset(string assetId)` — Retrieve asset details
- `getAssetHistory(string assetId)` — Get all events for asset
- `getEventCount(string assetId)` — Count events
- `getEvent(string assetId, uint256 index)` — Get specific event
- `assetExists(string assetId)` — Check if asset registered

**Authorization:**
- `setRecorderPermission(string assetId, address recorder, bool allowed)` — Grant/revoke recorder access
- `hasRecorderAccess(string assetId, address recorder)` — Check permissions

### Security Features

- ✅ Solidity 0.8.20 (overflow protection built-in)
- ✅ Event emission for all state changes
- ✅ Creator-based access control
- ✅ Timestamp proof for temporal ordering
- ✅ No reentrancy vulnerabilities (pure state changes)
- ✅ Input validation on critical functions
- ⚠️ **Not audited** — This is demonstration code

## Frontend Architecture

### Main Components

**WalletConnect:**
- Connect/disconnect MetaMask
- Display account and network
- Show balance

**RegisterAsset:**
- Form to register new assets
- Input validation
- Transaction status feedback

**RecordEvent:**
- Add provenance events to existing assets
- Location tracking
- Evidence hash input (IPFS CID, file hash)
- Event type selection

**SearchAsset:**
- Query asset by ID
- Display asset details
- Show current status and location

**ProvenanceTimeline:**
- Visual timeline of asset events
- Chronological ordering
- Event details with timestamps
- Location history map

**VerifyAsset:**
- Public verification page
- No wallet connection required
- Display immutable record
- Link to blockchain explorer

### Data Flow

```
User Action (Register Asset, Record Event)
    ↓
Form Component Validation
    ↓
Wallet Context (get signer)
    ↓
Contract Interaction (ethers.js)
    ↓
MetaMask Signature & Confirmation
    ↓
Blockchain Execution
    ↓
Event Emission (contract logs)
    ↓
UI Update (success/error state)
    ↓
User Feedback (toast, alert)
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Testnet ETH/MATIC for gas fees
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TODD43/td-supplychain-dapp.git
   cd td-supplychain-dapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see [DEPLOYMENT.md](./DEPLOYMENT.md))

## Local Development

### Quick Start with Hardhat Node

**Terminal 1: Start blockchain**
```bash
npm run node
```

**Terminal 2: Deploy contract**
```bash
npm run deploy:local
```

**Terminal 3: Start frontend**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Configure MetaMask for Local Testing

1. Add custom network:
   - **Network Name:** Hardhat
   - **RPC URL:** http://localhost:8545
   - **Chain ID:** 31337
   - **Currency:** ETH

2. Import test account (first Hardhat account private key)

3. Get test tokens from faucet or use Hardhat's initial balance

### Run Tests

```bash
# Unit tests
npm run test

# Tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Testnet Deployment

### Deploy to Sepolia

1. **Get RPC URL** from [Alchemy](https://www.alchemy.com) or [Infura](https://infura.io)
2. **Get testnet ETH** from [Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
3. **Configure .env.local:**
   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=your_private_key_without_0x
   ```
4. **Deploy:**
   ```bash
   npm run deploy:sepolia
   ```
5. **Update .env.local with contract address**
6. **Start frontend:**
   ```bash
   npm run dev
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## How to Use the DApp

### 1. Connect Wallet

```
UI: "Connect Wallet" button
↓
Select MetaMask
↓
Approve connection
↓
Wallet connected, address displays
```

### 2. Register an Asset

```
UI: "Register Asset" form
↓
Enter:
  - Asset ID (e.g., "SKU-2024-001")
  - Description (e.g., "Coffee beans, Ethiopian Yirgacheffe")
↓
Click "Register"
↓
MetaMask: Confirm transaction
↓
Blockchain: Asset recorded with timestamp
↓
UI: Success message with transaction link
```

### 3. Record Provenance Event

```
UI: "Record Event" form
↓
Enter:
  - Asset ID (existing asset)
  - Event Type (e.g., "harvested", "processed", "shipped")
  - Location (e.g., "Farm, Addis Ababa, Ethiopia")
  - Description (e.g., "Harvested and sorted")
  - Evidence Hash (IPFS CID or file SHA256)
↓
Click "Record Event"
↓
MetaMask: Confirm transaction
↓
Blockchain: Event recorded with timestamp
↓
UI: Success, event added to timeline
```

### 4. Verify Asset

```
UI: "Search" or "Verify" tab
↓
Enter Asset ID
↓
Click "Search"
↓
UI displays:
  - Current Status
  - Current Location
  - Registration Date
  - Creator Address
  - Complete Timeline
  - All Events with Timestamps
↓
Click on events for details
↓
Click transaction hash for blockchain explorer
```

### 5. View Timeline

```
UI: "Timeline" tab
↓
Visual chronological display:
  ├─ Registered [timestamp]
  ├─ Event 1: Manufactured [timestamp]
  ├─ Event 2: Shipped [timestamp]
  ├─ Event 3: Received [timestamp]
  └─ Event 4: Verified [timestamp]
↓
Each event shows:
  - Type & Description
  - Location
  - Evidence Hash (with IPFS link if applicable)
  - Recorder Address
```

## Example Supply Chain Workflow

### Coffee Bean Traceability

```
1. FARM (Day 1)
   Asset Registered: "Coffee-Lot-2024-001"
   Description: "Ethiopian Yirgacheffe, Natural Process"
   Creator: Farm Owner Address
   
   Event: "Harvested"
   Location: "Farm, Addis Ababa, Ethiopia"
   Evidence: QmXx... (IPFS hash of harvest photos)
   Timestamp: 2024-01-15 08:30 UTC

2. PROCESSING (Day 2-5)
   Event: "Dried"
   Location: "Drying Station, Addis Ababa"
   Evidence: QmYy... (quality control report)
   Timestamp: 2024-01-18 14:20 UTC
   
   Event: "Sorted & Graded"
   Location: "Processing Facility, Addis Ababa"
   Evidence: QmZz... (grading certificate)
   Timestamp: 2024-01-20 10:45 UTC

3. EXPORT (Day 6-8)
   Event: "Packaged"
   Location: "Port Authority Warehouse, Djibouti"
   Evidence: Qm11... (packaging photos)
   Timestamp: 2024-01-22 16:00 UTC
   
   Event: "Shipped"
   Location: "Port of Djibouti → Hamburg, Germany"
   Evidence: Qm22... (bill of lading hash)
   Timestamp: 2024-01-23 09:00 UTC

4. IMPORT (Day 15-16)
   Event: "Received"
   Location: "Hamburg Port, Germany"
   Evidence: Qm33... (customs clearance)
   Timestamp: 2024-02-06 11:30 UTC
   
   Event: "Inspected & Certified"
   Location: "Quality Lab, Hamburg"
   Evidence: Qm44... (lab report, 95 points)
   Timestamp: 2024-02-07 09:15 UTC

5. RETAIL (Day 17)
   Event: "Available for Sale"
   Location: "Specialty Coffee Roaster, Berlin"
   Evidence: Qm55... (product listing photos)
   Timestamp: 2024-02-08 14:00 UTC

6. CONSUMER VERIFICATION
   Any customer can scan QR code or enter asset ID
   → See complete immutable history from farm to retail
   → Verify authenticity and origin
   → Check quality certifications
   → See all handling locations
   → Confirm no intermediaries tampered with record
```

## Security & Limitations

### What This Project Protects Against

- **Record Tampering**: Immutable blockchain record
- **False Claims**: Cryptographic timestamps
- **Counterfeit Products**: Public verification anyone can perform
- **Lost History**: Permanent on-chain storage

### What This Project Does NOT Address

- **Physical Tampering**: Still requires secure logistics
- **Permissions Enforcement**: Must be implemented off-chain
- **Identity Verification**: Must verify recorder identity separately
- **Product Authenticity**: Records what happened, not if it's real
- **Third-Party Audits**: Not independently audited
- **Production Readiness**: Testnet only, no insurance/bonds

### Security Disclaimer

**⚠️ This is a portfolio/demonstration project. It has NOT been independently audited for production use.**

Before any production deployment:

1. **Engage professional security auditors**
   - Budget: $10,000-$50,000+
   - Timeline: 4-8 weeks
   - Firms: OpenZeppelin, Trail of Bits, Consensys, etc.

2. **Implement additional safeguards**
   - Multi-signature requirements
   - Time-lock contracts
   - Emergency pause functions
   - Insurance/bonds
   - Legal framework
   - Compliance review

3. **Infrastructure hardening**
   - RPC endpoint redundancy
   - Rate limiting
   - DDoS protection
   - Monitoring & alerting
   - Incident response plan

See [SECURITY.md](./SECURITY.md) for complete details.

## Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server (localhost:5173)
npm run build            # Build frontend for production

# Smart Contracts
npm run compile          # Compile Solidity contracts
npm run test             # Run contract unit tests
npm run test:coverage    # Generate test coverage
npm run test:watch       # Watch mode testing

# Deployment
npm run node             # Start local Hardhat blockchain
npm run deploy:local     # Deploy to localhost
npm run deploy:sepolia   # Deploy to Sepolia testnet
npm run deploy:mumbai    # Deploy to Polygon Mumbai

# Code Quality
npm run lint             # Lint frontend code
npm run format           # Format code with Prettier
```

## Technology References

### Blockchain & Web3
- [Solidity Documentation](https://docs.soliditylang.org/)
- [ethers.js v6](https://docs.ethers.org/v6/)
- [Hardhat](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum Dev Docs](https://ethereum.org/en/developers/docs/)

### Frontend
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Supply Chain & Provenance
- [ISO 8402:2015 (Quality Management)](https://www.iso.org/standard/63817.html)
- [GS1 Standards](https://www.gs1.org/)
- [Traceability Systems Overview](https://en.wikipedia.org/wiki/Traceability)
- [Blockchain Supply Chain](https://en.wikipedia.org/wiki/Blockchain#Supply_chain)

## Roadmap

### Phase 1: Foundation (Current)
- [x] Basic asset registration
- [x] Event recording
- [x] Location tracking
- [x] Public verification
- [x] Testnet deployment

### Phase 2: Enhancement
- [ ] Professional security audit
- [ ] Batch event recording
- [ ] Asset image gallery
- [ ] Document/certificate storage
- [ ] QR code generation
- [ ] Advanced search/filtering
- [ ] Export capabilities (PDF, CSV)

### Phase 3: Scale
- [ ] Mainnet deployment
- [ ] The Graph indexing
- [ ] Mobile app
- [ ] Offline mode
- [ ] Multi-chain support
- [ ] API for integrations
- [ ] Insurance/liability framework

### Phase 4: Enterprise
- [ ] Multi-organization workflows
- [ ] Governance tokens
- [ ] Reputation systems
- [ ] Dispute resolution
- [ ] Compliance reporting
- [ ] Regulatory integration

## Conceptual References

This project is an **independent technology concept** developed by Todd Adrian that combines elements inspired by:

1. **0000345 OneApp** (https://0000345.oneapp.dev)
   - Decentralized application architecture
   - User-centric data models

2. **RedTree-Ke** (https://www.redtree-ke.com)
   - Real-world asset tracking
   - Transparent transaction records

**Important Disclaimer:**
- This is NOT derived from proprietary code of either project
- This is NOT endorsed by, affiliated with, or associated with either project
- This is NOT a partnership or collaboration
- This is an independent implementation of blockchain provenance concepts
- No code, assets, branding, or designs are copied from either project

## License

MIT License — See [LICENSE](./LICENSE) file for details.

```
Copyright (c) 2026 Todd Adrian
```

## Author

**Todd Adrian**
- GitHub: [@TODD43](https://github.com/TODD43)
- Portfolio: [GitHub Profile](https://github.com/TODD43)
- WhatsApp: +254 746 103 062

## Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/TODD43/td-supplychain-dapp/issues)
- **Discussions**: [General questions and ideas](https://github.com/TODD43/td-supplychain-dapp/discussions)
- **Repository**: https://github.com/TODD43/td-supplychain-dapp

## Disclaimer

This is a portfolio/demonstration project for educational purposes. It has NOT been independently audited and should NOT be used in production without appropriate security review, testing, and legal/compliance assessment.

See [SECURITY.md](./SECURITY.md) for complete disclaimers and limitations.

---

**Last Updated:** September 2026
**Status:** Testnet Demonstration
**Production Ready:** ❌ (requires audit)
