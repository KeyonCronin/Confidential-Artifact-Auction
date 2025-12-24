# Artifact Auction Project - Setup Instructions

## Quick Start

### 1. Prerequisites
- Node.js >= 20
- npm >= 7.0.0
- Git

### 2. Installation

```bash
cd D:\\\ConfidentialArtifactAuction
npm install
```

### 3. Compile Contract

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeChain types
- Create artifacts in `artifacts/` directory

### 4. Run Tests

```bash
npm run test
```

Expected output: All tests passing

### 5. Code Quality Check

```bash
npm run lint
npm run prettier:check
```

### 6. Format Code

```bash
npm run prettier:write
```

## Development Workflow

### Edit Smart Contract
1. Make changes to `contracts/ArtifactAuction.sol`
2. Run `npm run compile` to check for syntax errors
3. Update tests if needed
4. Run `npm run test` to verify functionality

### Add New Tests
1. Create new test files in `test/` directory
2. Follow the naming convention: `<ContractName>.ts`
3. Use the existing test structure as a template
4. Run `npm run test` to execute

### Deploy Contract

#### Local Testing
```bash
npm run chain
# In another terminal:
npm run deploy:localhost
```

#### Sepolia Testnet
```bash
export MNEMONIC="your twelve word mnemonic"
export INFURA_API_KEY="your infura key"
npm run deploy:sepolia
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile Solidity contracts |
| `npm run test` | Run all tests |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run ESLint and Solhint |
| `npm run lint:sol` | Run Solhint only |
| `npm run lint:ts` | Run ESLint only |
| `npm run prettier:check` | Check code formatting |
| `npm run prettier:write` | Format code automatically |
| `npm run clean` | Clean all generated files |
| `npm run typechain` | Generate TypeChain types |
| `npm run chain` | Start Hardhat node |
| `npm run deploy:localhost` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |

## Hardhat Tasks

### Get Auction Info
```bash
npx hardhat auction:info --id 1
```

### List Active Auctions
```bash
npx hardhat auction:list
```

## Project Structure Explanation

- **contracts/** - Solidity smart contracts
- **test/** - Test files using Hardhat and Chai
- **deploy/** - Deployment scripts using hardhat-deploy
- **tasks/** - Custom Hardhat tasks
- **artifacts/** - Generated contract artifacts (created after compile)
- **types/** - Generated TypeChain types (created after compile)
- **cache/** - Hardhat cache (created during compilation)

## Configuration Files

- **hardhat.config.ts** - Hardhat configuration
- **tsconfig.json** - TypeScript configuration
- **.eslintrc.yml** - ESLint rules
- **.prettierrc.yml** - Code formatting rules
- **.solhint.json** - Solidity linting rules
- **.solcover.js** - Coverage settings
- **.gitignore** - Git ignore patterns

## Environment Variables

Create a `.env` file (optional) with:

```
MNEMONIC=your twelve word mnemonic here
INFURA_API_KEY=your infura api key
ETHERSCAN_API_KEY=your etherscan api key
```

## Troubleshooting

### Port Already in Use
If port 8545 is already in use for Hardhat node:
```bash
npx hardhat node --port 8546
```

### Clear Build Cache
```bash
npm run clean
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- Hardhat Documentation: https://hardhat.org
- FHEVM Documentation: https://docs.zama.ai/fhevm
- Solidity Documentation: https://docs.soliditylang.org

## Support

For issues or questions:
1. Check the README.md
2. Review Hardhat documentation
3. Check Zama community resources

---

Ready to develop! Happy coding!
