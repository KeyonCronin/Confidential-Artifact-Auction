# Contributing to FHEVM Artifact Auction

Thank you for your interest in contributing to this FHEVM example project! This document provides guidelines for contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and professional
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards others

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

1. **Bug Reports**: Report issues you discover
2. **Feature Requests**: Suggest new functionality
3. **Code Contributions**: Submit bug fixes or features
4. **Documentation**: Improve or add documentation
5. **Examples**: Create new FHEVM examples
6. **Tests**: Add or improve test coverage

### Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your changes
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/artifact-auction.git
cd artifact-auction

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test
```

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run compile
npm run test
npm run lint

# Commit changes
git add .
git commit -m "Description of changes"

# Push to your fork
git push origin feature/your-feature-name
```

## Coding Standards

### Solidity Style Guide

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

- Use 4 spaces for indentation
- Follow naming conventions:
  - Contracts: PascalCase
  - Functions: camelCase
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- Add NatSpec comments for all public functions

Example:

```solidity
/// @notice Creates a new auction
/// @param _name Name of the artifact
/// @return auctionId The ID of the created auction
function createAuction(string memory _name) external returns (uint32 auctionId) {
    // Implementation
}
```

### TypeScript Style Guide

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Use meaningful variable names
- Add JSDoc comments for functions

Example:

```typescript
/**
 * Test: Verifies auction creation
 * Expected: Auction is created with correct parameters
 */
it("should create auction successfully", async function () {
  // Test implementation
});
```

### Code Quality

Before submitting, ensure:

```bash
# Linting passes
npm run lint

# Tests pass
npm run test

# Code is formatted
npm run prettier:write
```

## Pull Request Process

### Before Submitting

1. **Update Tests**: Add tests for new features
2. **Update Documentation**: Update README if needed
3. **Run Full Test Suite**: Ensure all tests pass
4. **Follow Style Guide**: Lint and format code
5. **Commit Messages**: Write clear commit messages

### PR Description

Include in your PR description:

- **Purpose**: What does this PR do?
- **Changes**: What files were changed?
- **Testing**: How was this tested?
- **Breaking Changes**: Any breaking changes?
- **Related Issues**: Link related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Manually tested

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated Checks**: CI tests must pass
2. **Code Review**: At least one review required
3. **Changes Requested**: Address feedback
4. **Approval**: PR approved by maintainer
5. **Merge**: Maintainer merges PR

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Title**: Clear, descriptive title
2. **Description**: Detailed description
3. **Steps to Reproduce**: Exact steps
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Environment**: OS, Node version, etc.
7. **Code Sample**: Minimal reproducible code

### Feature Requests

When requesting features, include:

1. **Title**: Clear feature description
2. **Problem**: What problem does this solve?
3. **Solution**: Proposed solution
4. **Alternatives**: Alternative solutions considered
5. **Additional Context**: Any other context

## Development Guidelines

### Writing Tests

- Test all new functionality
- Include edge cases
- Use descriptive test names
- Add JSDoc comments to tests
- Keep tests focused and isolated

Example:

```typescript
describe("Bidding", function () {
  /**
   * Test: Validates minimum bid requirement
   * Expected: Transaction reverts if bid is below minimum
   */
  it("should reject bids below minimum", async function () {
    await expect(
      contract.placeBid(1, lowBidAmount)
    ).to.be.revertedWith("Bid below minimum");
  });
});
```

### Adding Documentation

- Update README.md for new features
- Add inline code comments
- Update DEVELOPER_GUIDE.md if needed
- Generate API documentation
- Include usage examples

### Security Considerations

- Never commit secrets or private keys
- Validate all user inputs
- Consider reentrancy attacks
- Use OpenZeppelin libraries
- Follow FHEVM best practices

## FHEVM Specific Guidelines

### Encrypted Operations

- Always set proper permissions with FHE.allow
- Handle decryption properly
- Validate encrypted inputs
- Document encryption requirements

### Testing Encrypted Values

```typescript
// Create encrypted value
const encrypted = FHE.asEuint32(100);

// Set permissions
await contract.setPermissions(encrypted, address);

// Test functionality
const result = await contract.process(encrypted);
```

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions
- **Discord**: Real-time chat
- **Forum**: In-depth discussions

### Getting Help

If you need help:

1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Join Discord community

## Recognition

Contributors will be:

- Listed in release notes
- Acknowledged in documentation
- Thanked in commit messages

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?

If you have questions about contributing, please:

1. Check this guide
2. Review DEVELOPER_GUIDE.md
3. Open a GitHub Discussion
4. Ask in Discord

Thank you for contributing to FHEVM examples!
