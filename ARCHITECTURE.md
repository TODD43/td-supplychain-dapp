# TD SupplyChain DApp — Architecture & Technical Details

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│   User Browser (React Frontend)                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  React Components                                          │  │
│  │  - RegisterAsset                                           │  │
│  │  - RecordEvent                                             │  │
│  │  - SearchAsset                                             │  │
│  │  - AssetDetails                                            │  │
│  │  - ProvenanceTimeline                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│            │                                                      │
│            │ ethers.js                                            │
│            ▼                                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Wallet Context                                            │  │
│  │  - Account Management                                      │  │
│  │  - Provider Connection                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
            │
            │ JSON-RPC over HTTP(S)
            ▼
┌──────────────────────────────────────────────────────────────────┐
│   Web3 Provider (MetaMask, etc)                                  │
│  - Manages private keys                                          │
│  - Signs transactions                                            │
└──────────────────────────────────────────────────────────────────┘
            │
            │ Transactions
            ▼
┌──────────────────────────────────────────────────────────────────┐
│   Blockchain Network                                             │
│  (Sepolia / Mumbai / Localhost)                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  SupplyChain Smart Contract                               │  │
│  │  - Asset Management                                       │  │
│  │  - Event Recording                                        │  │
│  │  - Provenance History                                     │  │
│  │  - Access Control                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### SupplyChain.sol Structure

```solidity
contract SupplyChain {
  // Data Structures
  struct Asset {
    string id;
    address creator;
    string description;
    uint256 createdAt;
    string currentStatus;
    string currentLocation;
    bool isActive;
  }

  struct ProvenanceEvent {
    uint256 timestamp;
    string eventType;
    string description;
    string location;
    string evidenceHash;
    address recorder;
  }

  // State
  mapping(string => Asset) public assets;
  mapping(string => ProvenanceEvent[]) public assetHistory;
  mapping(string => mapping(address => bool)) public recorders;
  mapping(string => bool) private _assetExists;
  address public owner;
  string[] private assetIds;

  // Functions
  - registerAsset()
  - recordEvent()
  - updateStatus()
  - updateLocation()
  - setRecorderPermission()
  - deactivateAsset()
  - getAsset()
  - getAssetHistory()
  - hasRecorderAccess()
  - assetExists()
}
```

### Data Flow: Asset Registration

```
1. User fills Registration Form
   - Asset ID (string, max 50 chars)
   - Description (string, max 500 chars)

2. Frontend Validation
   - Checks ID not empty
   - Checks description not empty
   - Checks ID format

3. Contract Call
   - registerAsset(assetId, description)

4. MetaMask
   - User confirms transaction
   - Signs with private key

5. Blockchain Execution
   - Contract stores Asset struct
   - Initializes ProvenanceEvent array
   - Grants creator recorder permission
   - Emits AssetRegistered event

6. Event Emission
   - Frontend receives event
   - Updates UI with success
   - Asset now queryable
```

### Data Flow: Event Recording

```
1. User fills Event Form
   - Asset ID (from search)
   - Event Type (dropdown)
   - Description (textarea)
   - Location (text field)
   - Evidence Hash (optional)

2. Authorization Check
   - Contract verifies caller is creator OR has permission
   - If not authorized, transaction reverts

3. Event Creation
   - Create ProvenanceEvent struct with timestamp
   - Push to assetHistory[assetId] array
   - Emit EventRecorded event

4. Frontend Update
   - Poll contract for new events
   - Refresh asset details
   - Display in timeline UI
```

## Frontend Architecture

### Component Hierarchy

```
App (main component)
├── Header
│   └── WalletConnect
├── Main Content
│   ├── Welcome Screen (if disconnected)
│   └── Dashboard (if connected)
│       ├── Tab: Register Asset
│       │   └── RegisterAsset Component
│       ├── Tab: Record Event
│       │   └── RecordEvent Component
│       ├── Tab: Search
│       │   └── SearchAsset Component
│       └── Tab: Verify
│           ├── AssetDetails Component
│           └── ProvenanceTimeline Component
└── Footer
```

### State Management

**Global State (Context):**
```typescript
WalletContext {
  - account: string | null
  - isConnected: boolean
  - provider: BrowserProvider | null
  - balance: string
  - chainId: number | null
  - connect(): Promise<void>
  - disconnect(): void
}
```

**Component State (Hooks):**
```typescript
useSupplyChainContract(contractAddress)
  - Returns: Contract instance or null

useAssetDetails(contract, assetId)
  - Returns: { asset, history, loading, error }
```

**Local Component State:**
- Form inputs (asset ID, description, etc.)
- Transaction status (pending, success, error)
- Error messages
- Loading states

### User Interaction Flow

```
User Action (e.g., Register Asset)
    │
    ├─► Form Component
    │   - Captures user input
    │   - Validates input
    │
    ├─► Event Handler
    │   - Prepares transaction data
    │   - Sets loading state
    │
    ├─► Contract Call (ethers.js)
    │   - Gets signer from wallet
    │   - Sends transaction to contract
    │
    ├─► MetaMask
    │   - Shows confirmation dialog
    │   - User approves
    │   - Signs transaction
    │
    ├─► Blockchain
    │   - Network processes transaction
    │   - Contract executes function
    │   - Emits event
    │
    ├─► Frontend
    │   - Waits for confirmation
    │   - Refreshes data via hook
    │   - Updates UI with result
    │
    └─► User Feedback
        - Success/error alert
        - Updated asset list/details
        - Ready for next action
```

## Deployment Architecture

### Local Development

```
Hardhat Node (localhost:8545)
    │
    ├─► Compiled Contracts
    │
    ├─► Deployment Scripts
    │   - Deploy SupplyChain contract
    │   - Return contract address
    │
    └─► React Dev Server (localhost:5173)
        - Hot module replacement
        - .env.local points to local contract
```

### Testnet Deployment

```
Testnet RPC (Alchemy/Infura)
    │
    ├─► Compiled & Deployed Contract
    │   - Stored on Sepolia/Mumbai
    │   - Accessible via RPC
    │   - Has transaction history
    │
    └─► Frontend
        - Built with `npm run build`
        - Deployed to Vercel/Netlify
        - Points to testnet contract
        - All data immutable on-chain
```

## Security Architecture

### Smart Contract Level

```
Access Control:
├─ Creator Only
│  ├── updateStatus()
│  ├── updateLocation()
│  ├── setRecorderPermission()
│  └── deactivateAsset()
│
└─ Creator or Authorized Recorder
   └── recordEvent()

Input Validation:
├─ String length checks
├─ Empty string checks
├─ Address validation
└─ Asset existence checks

State Safety:
├─ Solidity 0.8.20+ (overflow protection)
├─ Immutable timestamps
├─ Event emission for auditing
└─ No delegatecall/external calls
```

### Frontend Level

```
Input Validation:
├─ Client-side format checking
├─ Length limits
├─ Type validation
└─ User feedback on errors

Wallet Integration:
├─ MetaMask only (currently)
├─ No seed phrase handling
├─ No private key storage
└─ Delegation to wallet

Error Handling:
├─ Try-catch on all transactions
├─ User-friendly error messages
├─ Transaction status display
└─ Retry capability
```

## Performance Considerations

### Gas Usage (Approximate)

```
registerAsset()      ~70,000 gas
recordEvent()        ~80,000 gas
updateStatus()       ~45,000 gas
updateLocation()     ~45,000 gas
setRecorderPermission() ~50,000 gas
```

### Frontend Performance

- Initial load: <2 seconds (optimized)
- Contract interaction: <500ms (with user confirmation)
- Asset list fetch: <1 second
- Timeline rendering: <500ms (even with 50+ events)
- Real-time updates: 10-second refresh interval

### Scalability Limits

**Current Implementation:**
- Single contract instance
- No pagination for event history
- No batched operations
- No off-chain indexing

**Future Improvements:**
- The Graph for indexing
- Event filtering and pagination
- Batch event recording
- Contract upgrades (proxy pattern)

## Dependencies

### Smart Contract Dependencies

```
@openzeppelin/contracts/ (not used currently, but recommended for future)
- Ownable (for access control)
- Pausable (for emergency stops)
- ReentrancyGuard (for safety)
```

### Frontend Dependencies

```
Core:
- react@18.2.0
- react-dom@18.2.0
- ethers@6.8.0

Styling:
- tailwindcss@3.3.0
- postcss@8.4.0
- autoprefixer@10.4.0

Build:
- vite@5.0.0
- @vitejs/plugin-react@4.0.0
- typescript@5.0.0

Development:
- hardhat@2.17.0
- @nomicfoundation/hardhat-toolbox@3.0.0
- typechain@8.3.0
```

## Testing Strategy

### Unit Tests

```typescript
SupplyChain.test.ts
├── Asset Registration
│   ├── Should register new asset
│   ├── Should prevent duplicate IDs
│   └── Should grant creator permission
├── Event Recording
│   ├── Should record event
│   ├── Should prevent unauthorized recorder
│   └── Should validate inputs
├── Status & Location Updates
│   ├── Should update status
│   ├── Should update location
│   └── Should prevent non-creator
├── Recorder Permissions
│   ├── Should grant permission
│   └── Should revoke permission
└── View Functions
    ├── Should get asset details
    ├── Should get history
    └── Should check permissions
```

### Coverage Target

- Line coverage: >95%
- Branch coverage: >90%
- Function coverage: 100%

---

**Last Updated:** September 2026
**Version:** 1.0.0
**Status:** Testnet Demonstration
