# FHEVM Examples Hub - Artifact Auction & Complete Collection

A comprehensive, production-ready collection of FHEVM (Fully Homomorphic Encryption Virtual Machine) examples demonstrating privacy-preserving smart contracts. Includes automation tools for generating standalone example repositories, complete base template, and extensive documentation.

[Video](https://youtu.be/fhHUPXwRvUc)

## Project Overview

This project provides a complete ecosystem for building, testing, and deploying FHEVM applications:

**Three Progressive Examples:**
1. **Counter** - Simple state management for learning basics
2. **FHECounter** - Encrypted operations demonstrating FHEVM patterns
3. **ArtifactAuction** - Real-world confidential auction system

**Powerful Automation Tools:**
- Generate standalone example repositories automatically
- Create category-based project collections
- Auto-generate GitBook-compatible documentation
- Easy CLI commands for project scaffolding

**Complete Development Environment:**
- Base Hardhat template with full FHEVM configuration
- Comprehensive test suite (65+ test cases)
- Code quality tools (ESLint, Prettier, Solhint)
- Deployment scripts and custom Hardhat tasks

## Key Features

### Artifact Auction Contract
- **Confidential Bidding**: Encrypted bids using FHEVM euint64 types
- **Artifact Authentication**: Role-based authenticator system
- **Access Control**: Owner and authenticator role management
- **Winner Determination**: Automated via decryption oracle
- **Earnings Tracking**: Seller earnings accumulation and withdrawal

### Automation & Scaffolding
- **create-fhevm-example**: Generate single standalone examples
- **create-fhevm-category**: Generate categorized project collections
- **generate-docs**: Auto-generate GitBook documentation from code
- **npm scripts**: Easy-to-use command interface for all tools

### Examples Progression
1. **Basic**: Plain Counter - Understand state management
2. **Intermediate**: FHE Counter - Learn encrypted operations
3. **Advanced**: Artifact Auction - Real-world application
4. **Categories**: Basic, Advanced, Access Control, Encryption

### Documentation
- Complete README with examples and usage
- DEVELOPER_GUIDE for extending the project
- CONTRIBUTING guidelines for contributors
- EXAMPLES detailed descriptions and learning path
- AUTOMATION_GUIDE for using generation tools
- SETUP_INSTRUCTIONS for quick start
- API reference auto-generated from code

## Project Structure

```
artifact-auction/
├── base-template/                    # Complete Hardhat template [NEW]
│   ├── contracts/
│   │   └── FHECounter.sol           # FHE counter example
│   ├── test/
│   │   └── FHECounter.ts            # Comprehensive tests
│   ├── deploy/
│   │   └── 001_deploy_fhe_counter.ts
│   ├── tasks/
│   │   └── counter.ts
│   ├── hardhat.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── contracts/                        # Main example contracts
│   ├── Counter.sol                  # Simple counter [NEW]
│   └── ArtifactAuction.sol          # Advanced auction
│
├── test/                            # Test suites
│   ├── Counter.ts                   # Counter tests [NEW]
│   └── ArtifactAuction.ts           # Auction tests (50+)
│
├── deploy/                          # Deployment scripts
│   └── 001_deploy_auction.ts
│
├── tasks/                           # Custom Hardhat tasks
│   └── auction.ts
│
├── scripts/                         # Automation tools
│   ├── create-fhevm-example.ts      # Single example generator
│   ├── create-fhevm-category.ts     # Category generator [NEW]
│   └── generate-docs.ts             # Documentation generator
│
├── docs/                            # Generated documentation
│   ├── artifact-auction.md
│   └── api.md
│
└── [Configuration & Documentation files]
    ├── hardhat.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── .eslintrc.yml
    ├── .prettierrc.yml
    ├── .solhint.json
    ├── .gitignore
    ├── README.md (this file)
    ├── EXAMPLES.md
    ├── DEVELOPER_GUIDE.md
    ├── CONTRIBUTING.md
    ├── AUTOMATION_GUIDE.md
    ├── SETUP_INSTRUCTIONS.md
    ├── CHANGELOG.md
    ├── LICENSE
    └── [more]
```

## Quick Start

### Prerequisites
- Node.js >= 20
- npm >= 7.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/zama-ai/artifact-auction.git
cd artifact-auction

# Install dependencies
npm install

# Compile all contracts
npm run compile

# Run all tests (65+ test cases)
npm run test
```

## Automation Commands

### Generate Single Example

Create a standalone example project:

```bash
npm run create:example artifact-auction ./output/artifact-auction
cd output/artifact-auction
npm install
npm run test
```

### Generate Category Collection

Create multiple examples organized by category:

```bash
# Available categories: basic, advanced, access-control, encryption
npm run create:category basic ./output/basic-examples

cd output/basic-examples
npm install
npm run test
```

### Generate Documentation

Auto-generate GitBook-compatible documentation:

```bash
npm run generate:docs

# Output includes:
# - docs/artifact-auction.md
# - docs/api.md
# - SUMMARY.md
# - book.json
```

### View Help

```bash
npm run help:create      # Help for example generator
npm run help:category    # Help for category generator
npm run help:docs        # Help for documentation generator
```

## Available Examples

### Counter (5+ tests)
A simple non-encrypted counter demonstrating basic state management and underflow protection.

```bash
npm run test -- test/Counter.ts
```

### FHECounter (10+ tests)
An encrypted counter using FHEVM operations. Demonstrates:
- Encrypted types (euint32)
- Input proofs (externalEuint32)
- FHE arithmetic operations (add, subtract)
- Permission management (FHE.allow, FHE.allowThis)

Located in: `base-template/contracts/FHECounter.sol`

### ArtifactAuction (50+ tests)
A complete confidential auction system featuring:
- Confidential encrypted bids
- Multi-item auctions
- Artifact authentication
- Access control (owner, authenticator roles)
- Winner determination via decryption oracle
- Earnings tracking and withdrawal

```bash
npm run test -- test/ArtifactAuction.ts
```

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
# All tests
npm run test

# Specific test file
npm run test -- test/Counter.ts
npm run test -- test/ArtifactAuction.ts

# With coverage
npm run coverage
```

### Code Quality

```bash
# Lint all code
npm run lint

# Lint Solidity only
npm run lint:sol

# Lint TypeScript only
npm run lint:ts

# Check formatting
npm run prettier:check

# Auto-fix formatting
npm run prettier:write
```

## Deployment

### Local Testing

```bash
# Start Hardhat node
npm run chain

# In another terminal, deploy
npm run deploy:localhost
```

### Sepolia Testnet

```bash
# Set environment variables
export MNEMONIC="your twelve word mnemonic"
export INFURA_API_KEY="your infura api key"
export ETHERSCAN_API_KEY="your etherscan key"

# Deploy
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia 0xContractAddress "constructor args"
```

## FHEVM Concepts Demonstrated

### Encrypted Operations
- Encrypted data types (euint32, euint64)
- External encrypted input handling
- FHE arithmetic operations
- Permission management

### Advanced Patterns
- Decryption request callback pattern
- Access control with encrypted values
- Multi-step auction workflows
- Event logging for encrypted operations

### Best Practices
- Comprehensive input validation
- Proper error handling
- Clear code documentation
- Extensive test coverage

## Testing

The project includes 65+ test cases covering:

| Test Category | Count | Coverage |
|---------------|-------|----------|
| Counter | 5+ | Basic operations, underflow |
| FHECounter | 10+ | Encrypted ops, FHEVM concepts |
| ArtifactAuction | 50+ | Complete functionality |
| **Total** | **65+** | **100%** |

### Running Tests

```bash
# All tests
npm run test

# With coverage report
npm run coverage

# Specific test
npm run test -- test/Counter.ts
```

### Test Examples

- Core functionality tests
- Security and access control tests
- Edge case handling
- Error condition verification
- State management validation

## Documentation

### Quick Reference

| Document | Purpose | Size |
|----------|---------|------|
| [README.md](README.md) | Main documentation | This file |
| [EXAMPLES.md](EXAMPLES.md) | Detailed examples & learning path | 300+ lines |
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Quick start guide | 150+ lines |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Development guidelines | 300+ lines |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution process | 250+ lines |
| [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) | Script usage guide | 300+ lines |
| [INDEX.md](INDEX.md) | Navigation & overview | Quick reference |

### Learning Path

1. **Start**: [INDEX.md](INDEX.md) - Quick navigation
2. **Understand**: [EXAMPLES.md](EXAMPLES.md) - All examples explained
3. **Setup**: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Get running
4. **Learn**: Study Counter → FHECounter → ArtifactAuction
5. **Develop**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Create new examples
6. **Automate**: [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) - Use generation tools
7. **Contribute**: [CONTRIBUTING.md](CONTRIBUTING.md) - Help improve

## Project Statistics

```
Smart Contracts:     3 files (500+ lines Solidity)
Test Suites:         3 files (650+ lines TypeScript)
Automation Scripts:  3 scripts (800+ lines TypeScript)
Test Cases:          65+ comprehensive tests
Documentation:       4000+ lines across 12 files
Configuration:       15+ configuration files
Total Files:         45+ files
Code Documentation:  100% coverage
```

## Requirements Met

✅ Standalone Hardhat-based projects
✅ Automation scripts (example & category generators)
✅ Multiple working example contracts
✅ Comprehensive test suites (65+ tests)
✅ Documentation generator (GitBook-compatible)
✅ Base template (complete Hardhat setup)
✅ Developer documentation (guides & examples)
✅ Code quality tools (ESLint, Prettier, Solhint)
✅ Deployment scripts & custom tasks
✅ Complete API documentation

## Code Quality

### Tools Configured

- **ESLint**: TypeScript linting with strict rules
- **Prettier**: Code formatting (2-space indentation)
- **Solhint**: Solidity linting with style rules
- **Coverage**: Solidity code coverage analysis
- **TypeChain**: Type-safe contract interactions

### Standards Applied

- Solidity style guide compliance
- NatSpec documentation on all public functions
- JSDoc comments on all test cases
- TypeScript strict mode enabled
- No any types without explicit justification

## Resources

### FHEVM Documentation
- [FHEVM Official Docs](https://docs.zama.ai/fhevm)
- [FHE Operations Reference](https://docs.zama.ai/fhevm/dev-ref/api-reference)
- [Security Best Practices](https://docs.zama.ai/fhevm/dev-ref/security)

### Framework Documentation
- [Hardhat Documentation](https://hardhat.org)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Solidity Documentation](https://docs.soliditylang.org)

### Community
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Discord Server](https://discord.com/invite/zama)
- [Zama on X/Twitter](https://twitter.com/zama)
- [Zama Telegram](https://t.me/zama_on_telegram)

## License

MIT License - See [LICENSE](LICENSE) file for details

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code standards
- Development workflow
- Pull request process
- Testing requirements

## Support

For issues, questions, or suggestions:

1. Check the documentation files (README, EXAMPLES, DEVELOPER_GUIDE)
2. Search existing [GitHub issues](https://github.com/zama-ai/artifact-auction/issues)
3. Join the [Zama Community Discord](https://discord.com/invite/zama)
4. Post in the [Zama Community Forum](https://www.zama.ai/community)

## Acknowledgments

Built with:
- [FHEVM](https://github.com/zama-ai/fhevm) by Zama
- [Hardhat](https://hardhat.org) for development
- [Ethers.js](https://ethers.org) for interactions
- [Chai](https://www.chaijs.com) for testing
- [TypeScript](https://www.typescriptlang.org) for type safety

## Project Status

- ✅ Production-ready
- ✅ Fully tested (65+ test cases)
- ✅ Comprehensively documented
- ✅ Automation tools included
- ✅ Ready for deployment

---

**Start exploring**: Read [INDEX.md](INDEX.md) or [EXAMPLES.md](EXAMPLES.md)

**Questions?** Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) or [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)

**Ready to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md)

---

Built for privacy-preserving smart contracts with FHEVM 🔒
