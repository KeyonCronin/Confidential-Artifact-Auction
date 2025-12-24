# Developer Guide

This guide explains how to add new FHEVM examples, maintain the project, and handle dependency updates.

## Table of Contents

- [Project Structure](#project-structure)
- [Adding New Examples](#adding-new-examples)
- [Creating Tests](#creating-tests)
- [Documentation Standards](#documentation-standards)
- [Automation Scripts](#automation-scripts)
- [Updating Dependencies](#updating-dependencies)
- [Best Practices](#best-practices)

## Project Structure

```
artifact-auction/
├── contracts/              # Solidity smart contracts
├── test/                   # Test files
├── deploy/                 # Deployment scripts
├── tasks/                  # Hardhat custom tasks
├── scripts/                # Automation scripts
│   ├── create-fhevm-example.ts    # Example generator
│   └── generate-docs.ts           # Documentation generator
├── docs/                   # Generated documentation
├── hardhat.config.ts       # Hardhat configuration
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## Adding New Examples

### Step 1: Create the Smart Contract

Create a new Solidity file in `contracts/`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title MyNewExample
/// @notice Brief description of what this contract does
contract MyNewExample is SepoliaConfig {
    // Implementation
}
```

### Step 2: Write Comprehensive Tests

Create a test file in `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNewExample", function () {
  let contract: MyNewExample;
  let owner: any;

  beforeEach(async function () {
    const [ownerAccount] = await ethers.getSigners();
    owner = ownerAccount;

    const Factory = await ethers.getContractFactory("MyNewExample");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("Functionality", function () {
    /**
     * Test: Description of what this test verifies
     * Expected: What should happen
     */
    it("should perform expected behavior", async function () {
      // Test implementation
    });
  });
});
```

### Step 3: Create Deployment Script

Create a deployment script in `deploy/`:

```typescript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployment = await deploy("MyNewExample", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`MyNewExample deployed to: ${deployment.address}`);
};

export default func;
func.tags = ["MyNewExample"];
```

### Step 4: Update Automation Scripts

Add your example to `scripts/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'my-new-example': {
    contract: 'contracts/MyNewExample.sol',
    test: 'test/MyNewExample.ts',
    description: 'Brief description of the example',
    category: 'basic',
  },
  // Other examples...
};
```

### Step 5: Generate Documentation

Run the documentation generator:

```bash
npx ts-node scripts/generate-docs.ts
```

## Creating Tests

### Test Structure

Follow this structure for consistent testing:

```typescript
describe("ContractName", function () {
  // Setup
  let contract: ContractType;
  let accounts: SignerType[];

  beforeEach(async function () {
    // Deploy contract and set up test environment
  });

  describe("Feature Category", function () {
    /**
     * Test: Clear description of what is being tested
     * Expected: Clear description of expected behavior
     */
    it("should do something specific", async function () {
      // Arrange
      const input = setupTestData();

      // Act
      const result = await contract.functionCall(input);

      // Assert
      expect(result).to.equal(expectedValue);
    });
  });
});
```

### Testing FHEVM Operations

When testing encrypted operations:

```typescript
it("should handle encrypted values", async function () {
  const plainValue = 100;
  const encryptedValue = FHE.asEuint32(plainValue);

  const tx = await contract.processEncryptedValue(encryptedValue);
  await tx.wait();

  // Verify permissions
  expect(await contract.hasPermission(address)).to.be.true;
});
```

### Test Coverage Goals

- **Core Functionality**: Test all public functions
- **Edge Cases**: Test boundary conditions
- **Access Control**: Verify permission requirements
- **Error Handling**: Test failure scenarios
- **Integration**: Test component interactions

## Documentation Standards

### Code Comments

Use JSDoc-style comments for all functions:

```solidity
/// @notice Brief description of what the function does
/// @param paramName Description of the parameter
/// @return Description of the return value
function exampleFunction(uint256 paramName) external returns (uint256) {
    // Implementation
}
```

### Test Documentation

Add descriptive comments to tests:

```typescript
/**
 * Test: Verifies that users can place encrypted bids
 * Expected: Bid is recorded with proper encryption and permissions
 */
it("should allow encrypted bidding", async function () {
  // Test implementation
});
```

### README Structure

Each example should have a README with:

1. **Overview**: What the example demonstrates
2. **Installation**: Setup instructions
3. **Usage**: How to run and test
4. **Key Features**: What FHEVM concepts are shown
5. **Documentation Links**: References to resources

## Automation Scripts

### Using create-fhevm-example

Generate a new example repository:

```bash
npx ts-node scripts/create-fhevm-example.ts artifact-auction ./output/artifact-auction
```

This will:
- Copy the project structure
- Update package.json
- Generate README
- Configure deployment scripts

### Using generate-docs

Generate documentation from code:

```bash
npx ts-node scripts/generate-docs.ts
```

This will:
- Extract JSDoc comments
- Generate API documentation
- Create GitBook structure
- Build SUMMARY.md

### Custom Scripts

Add custom npm scripts in `package.json`:

```json
{
  "scripts": {
    "create:example": "npx ts-node scripts/create-fhevm-example.ts",
    "docs:generate": "npx ts-node scripts/generate-docs.ts",
    "docs:serve": "gitbook serve"
  }
}
```

## Updating Dependencies

### Regular Updates

Check for updates monthly:

```bash
npm outdated
```

### FHEVM Updates

When updating FHEVM libraries:

1. **Check Changelog**: Review breaking changes
2. **Update Package**: `npm install @fhevm/solidity@latest`
3. **Update Imports**: Adjust contract imports if needed
4. **Run Tests**: Verify all tests pass
5. **Update Docs**: Document any API changes

### Hardhat Updates

```bash
npm install --save-dev hardhat@latest
npm install --save-dev @nomicfoundation/hardhat-ethers@latest
```

### Testing After Updates

```bash
npm run clean
npm run compile
npm run test
```

## Best Practices

### Smart Contract Development

1. **Use Latest Solidity**: Keep compiler up to date
2. **Follow Standards**: Use OpenZeppelin patterns
3. **Document Everything**: Write clear comments
4. **Test Thoroughly**: Aim for high coverage
5. **Optimize Gas**: Use efficient patterns

### FHEVM Specific

1. **Manage Permissions**: Always set proper FHE.allow permissions
2. **Handle Decryption**: Implement proper decryption callbacks
3. **Validate Inputs**: Check encrypted value ranges
4. **Error Messages**: Provide clear revert messages
5. **Access Control**: Implement proper role management

### Testing

1. **Isolation**: Each test should be independent
2. **Coverage**: Test all code paths
3. **Edge Cases**: Include boundary tests
4. **Documentation**: Comment test intent
5. **Performance**: Keep tests fast

### Code Quality

1. **Linting**: Run ESLint and Solhint
2. **Formatting**: Use Prettier consistently
3. **Type Safety**: Enable strict TypeScript
4. **Reviews**: Get code reviews before merging
5. **CI/CD**: Automate testing and deployment

### Documentation

1. **Keep Updated**: Update docs with code changes
2. **Examples**: Provide usage examples
3. **Clear Language**: Write for developers
4. **Visual Aids**: Use diagrams where helpful
5. **Link Resources**: Reference official docs

## Troubleshooting

### Common Issues

**Problem**: Tests fail after dependency update
**Solution**: Run `npm run clean && npm install && npm run compile`

**Problem**: TypeScript errors in test files
**Solution**: Run `npm run typechain` to regenerate types

**Problem**: Deployment fails on testnet
**Solution**: Check environment variables and gas settings

### Getting Help

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org)
- [Zama Community Forum](https://www.zama.ai/community)
- [Discord Server](https://discord.com/invite/zama)

## Contributing

### Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit pull request

### Code Review Checklist

- [ ] All tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Gas optimization considered
- [ ] FHEVM best practices followed

## Versioning

Follow semantic versioning:

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes

Update version in `package.json` before release.

## Release Process

1. Update CHANGELOG.md
2. Bump version number
3. Run full test suite
4. Generate documentation
5. Create git tag
6. Push to repository
7. Create GitHub release

---

For questions or contributions, reach out to the development team or open an issue on GitHub.
