# FHEVM Examples - Complete Collection

This document describes all available FHEVM examples and how to use them.

## Overview

The project includes multiple FHEVM examples demonstrating different concepts:

1. **Basic Examples** - Fundamental operations and comparisons
2. **Advanced Examples** - Real-world applications
3. **Access Control Examples** - Permission and role patterns
4. **Encryption Examples** - Encryption/decryption workflows

## Basic Examples

### Counter

**Location**: `contracts/Counter.sol` | `test/Counter.ts`

A simple non-encrypted counter demonstrating basic state management:

```solidity
contract Counter {
    uint32 private _count;

    function increment(uint32 value) external { ... }
    function decrement(uint32 value) external { ... }
    function getCount() external view returns (uint32) { ... }
}
```

**Features**:
- Simple state updates
- Non-encrypted values
- Underflow protection

**Test Coverage**:
- Initial value
- Increment operations
- Decrement operations
- Underflow prevention
- Multiple operations

**Running**:
```bash
npm run test -- test/Counter.ts
```

### FHE Counter

**Location**: `base-template/contracts/FHECounter.sol`

An encrypted counter demonstrating FHE operations:

```solidity
contract FHECounter is ZamaEthereumConfig {
    euint32 private _count;

    function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external { ... }
    function decrement(externalEuint32 inputEuint32, bytes calldata inputProof) external { ... }
    function getCount() external view returns (euint32) { ... }
}
```

**Features**:
- Encrypted state using euint32
- FHE arithmetic operations
- Input proof verification
- Permission management with FHE.allow

**Comparison with Counter**:
- Uses encrypted types (euint32)
- Requires input proofs for external encrypted values
- Sets FHE permissions with FHE.allow and FHE.allowThis
- Operations performed on encrypted data directly

**Key FHEVM Concepts**:
- **euint32**: Encrypted unsigned 32-bit integer
- **FHE.fromExternal()**: Convert external encrypted input
- **FHE.add()**: Add encrypted values
- **FHE.sub()**: Subtract encrypted values
- **FHE.allow()**: Grant decryption permissions
- **FHE.allowThis()**: Allow contract access

## Advanced Examples

### Artifact Auction

**Location**: `contracts/ArtifactAuction.sol` | `test/ArtifactAuction.ts`

A confidential auction system for artifacts using FHEVM:

```solidity
contract ArtifactAuction is SepoliaConfig {
    struct AuctionDetails { ... }
    mapping(uint32 => AuctionDetails) public auctions;
    mapping(uint32 => mapping(address => EncryptedBid)) public bidsByAuction;

    function createAuction(...) external returns (uint32)
    function placeBid(uint32 auctionId, uint64 _bidAmount) external
    function endAuction(uint32 auctionId) external
    function authenticateArtifact(uint32 auctionId) external
}
```

**Features**:
- Multiple auctions management
- Encrypted bid amounts
- Artifact authentication
- Role-based access control
- Winner determination via decryption oracle
- Earnings tracking

**Key Concepts**:
- Auction lifecycle management
- Confidential bidding with FHEVM
- Authenticator role system
- Decryption callback pattern
- Multiple state transitions

**Test Coverage**:
- 50+ test cases
- Creation and validation
- Authentication system
- Encrypted bidding
- Access control
- Edge cases

**Running**:
```bash
npm run test -- test/ArtifactAuction.ts
```

## Using Automation Scripts

### Generate Single Example

Create a standalone example project:

```bash
npm run create:example artifact-auction ./output/artifact-auction
```

This creates a new directory with:
- Complete contract
- Test suite
- Configuration files
- Deployment scripts
- Documentation

### Generate Category

Create a category with multiple examples:

```bash
npm run create:category basic ./output/basic-examples
```

**Available Categories**:

#### Basic
Examples of fundamental FHE operations
- counter: Simple non-encrypted counter
- fhe-counter: Encrypted counter for comparison

```bash
npm run create:category basic ./output/basic
```

#### Advanced
Complex real-world applications
- artifact-auction: Confidential auction system

```bash
npm run create:category advanced ./output/advanced
```

### View Help

```bash
npm run help:create      # Single example help
npm run help:category    # Category help
npm run help:docs        # Documentation help
```

## Project Structure

```
artifact-auction/
├── base-template/              # Base Hardhat template
│   ├── contracts/
│   │   └── FHECounter.sol      # FHE counter example
│   ├── test/
│   ├── hardhat.config.ts
│   └── package.json
│
├── contracts/                  # Main examples
│   ├── Counter.sol             # Simple counter
│   └── ArtifactAuction.sol     # Advanced example
│
├── test/                       # Tests
│   ├── Counter.ts
│   └── ArtifactAuction.ts
│
└── scripts/                    # Automation scripts
    ├── create-fhevm-example.ts
    ├── create-fhevm-category.ts
    └── generate-docs.ts
```

## FHEVM Concepts Covered

### Basic Concepts
- **Encrypted Types**: euint32, euint64, etc.
- **External Input**: Converting public to encrypted
- **Arithmetic**: Addition, subtraction on encrypted values
- **Permissions**: FHE.allow, FHE.allowThis

### Advanced Concepts
- **Decryption Requests**: FHE.requestDecryption
- **Decryption Callbacks**: processBidResults callback
- **Access Control**: Role-based permissions
- **State Management**: Multiple encrypted state variables

### Best Practices
- Always set proper FHE permissions
- Use appropriate input proofs
- Document encryption requirements
- Implement proper error handling
- Consider gas optimization

## Running All Examples

### Compile All

```bash
npm run compile
```

### Test All

```bash
npm run test
```

### Test Specific Example

```bash
npm run test -- test/Counter.ts
npm run test -- test/ArtifactAuction.ts
```

### Generate Coverage

```bash
npm run coverage
```

## Example Workflow

### 1. Study Basic Example

Start with the Counter examples to understand:
- How state is managed
- How tests are structured
- The difference between plain and encrypted operations

```bash
npm run test -- test/Counter.ts
```

### 2. Understand FHE Operations

Review FHECounter to learn:
- Encrypted types
- Input proofs
- FHE operations
- Permission management

### 3. Study Advanced Pattern

Examine ArtifactAuction to understand:
- Complex state management
- Multiple components interaction
- Decryption workflows
- Role-based access control

```bash
npm run test -- test/ArtifactAuction.ts
```

### 4. Create Your Own

Use the automation scripts to generate your own example:

```bash
npm run create:example my-example ./output/my-example
cd output/my-example
npm install
npm run test
```

## Documentation

Each example includes:
- Inline code comments
- JSDoc/NatSpec documentation
- Test descriptions
- README with setup instructions

Generate documentation:

```bash
npm run generate:docs
```

This creates:
- `docs/artifact-auction.md` - Contract documentation
- `docs/api.md` - API reference
- `SUMMARY.md` - Documentation index

## Resources

### FHEVM Documentation
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [FHE Operations](https://docs.zama.ai/fhevm/dev-ref/api-reference)
- [Security Best Practices](https://docs.zama.ai/fhevm/dev-ref/security)

### Example Code
- Counter: Basic state management
- FHECounter: Encrypted operations
- ArtifactAuction: Complex application

### Testing
- [Hardhat Testing](https://hardhat.org/hardhat-runner/docs/guides/test)
- [Chai Assertions](https://www.chaijs.com/api/)

## Learning Path

1. **Start**: Read this file
2. **Basic**: Study Counter and FHECounter
3. **Advanced**: Review ArtifactAuction
4. **Practice**: Run tests and modify examples
5. **Create**: Build your own example using templates
6. **Deploy**: Use deployment scripts

## Common Patterns

### Encrypted State Update

```solidity
euint32 encryptedValue = FHE.fromExternal(input, proof);
_state = FHE.add(_state, encryptedValue);
FHE.allowThis(_state);
FHE.allow(_state, msg.sender);
```

### Access Control

```solidity
modifier onlyRole(Role role) {
    require(hasRole(role, msg.sender), "Access denied");
    _;
}
```

### Decryption Callback

```solidity
FHE.requestDecryption(values, this.processResults.selector);

function processResults(uint256 requestId, bytes memory cleartexts, bytes memory signatures) external {
    FHE.checkSignatures(requestId, cleartexts, signatures);
    // Process decrypted values
}
```

## Troubleshooting

**Q: How do I compare encrypted values?**
A: Use encrypted comparison operations (FHE.eq, FHE.lt, etc.)

**Q: How do I decrypt values?**
A: Use FHE.requestDecryption() and implement a callback function

**Q: How do I set permissions?**
A: Use FHE.allow() and FHE.allowThis() after creating encrypted values

**Q: Can I view encrypted values?**
A: No, they remain encrypted unless explicitly decrypted

## Contributing

To add a new example:
1. Create contract in `contracts/`
2. Create tests in `test/`
3. Update `EXAMPLES_MAP` in automation scripts
4. Document in this file
5. Ensure all tests pass

---

For more information, see:
- [README.md](README.md) - Main documentation
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Development guide
- [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) - Script usage
