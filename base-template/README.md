# FHEVM Hardhat Base Template

A minimal Hardhat template for developing FHEVM (Fully Homomorphic Encryption Virtual Machine) smart contracts.

## Overview

This template provides the foundation for building and testing FHEVM-enabled smart contracts using Hardhat. It includes:

- Complete Hardhat configuration for FHEVM development
- Support for encrypted data types from @fhevm/solidity
- TypeScript support with strict type checking
- Testing framework (Chai and Mocha)
- Code quality tools (ESLint, Prettier, Solhint)
- Gas reporting and coverage tools

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

## Project Structure

```
template/
├── contracts/       # Solidity smart contracts
├── test/           # Test files
├── deploy/         # Deployment scripts
├── tasks/          # Custom Hardhat tasks
├── hardhat.config.ts
├── package.json
└── tsconfig.json
```

## Available Commands

### Development

```bash
npm run compile    # Compile contracts
npm run test       # Run tests
npm run chain      # Start local Hardhat node
```

### Code Quality

```bash
npm run lint              # Run linters
npm run lint:sol          # Lint Solidity
npm run lint:ts           # Lint TypeScript
npm run prettier:check    # Check formatting
npm run prettier:write    # Format code
npm run coverage          # Generate test coverage
```

### Deployment

```bash
npm run deploy:localhost   # Deploy to local network
npm run deploy:sepolia     # Deploy to Sepolia testnet
npm run verify:sepolia     # Verify on Etherscan
```

## FHEVM Integration

This template includes the necessary imports and configurations for FHEVM:

```solidity
import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

### Configuration

The `hardhat.config.ts` includes:

- FHEVM Hardhat plugin integration
- Support for Sepolia testnet
- Proper EVM version settings (Cancun)
- TypeChain for type-safe contract interactions

## Creating Your First Contract

1. Add your Solidity contract to `contracts/`
2. Add corresponding tests to `test/`
3. Compile with `npm run compile`
4. Test with `npm run test`

## Development Workflow

```bash
# Start local node
npm run chain

# In another terminal
npm run deploy:localhost
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org)
- [Solidity Documentation](https://docs.soliditylang.org)
- [Zama Community](https://www.zama.ai/community)

## Configuration Files

- **hardhat.config.ts** - Hardhat configuration
- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript settings
- **.eslintrc.yml** - ESLint rules
- **.prettierrc.yml** - Code formatting rules
- **.solhint.json** - Solidity linting rules

## License

MIT License

## Support

For issues or questions:
- Check [FHEVM Documentation](https://docs.zama.ai/fhevm)
- Visit [Zama Community Forum](https://www.zama.ai/community)
- Join [Zama Discord](https://discord.com/invite/zama)
