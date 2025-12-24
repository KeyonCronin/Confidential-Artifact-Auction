# Automation Guide

This guide explains how to use the included automation scripts to generate examples and documentation.

## Overview

The project includes two main automation scripts:

1. **create-fhevm-example.ts** - Generate standalone FHEVM example repositories
2. **generate-docs.ts** - Generate GitBook-compatible documentation

## Quick Start

### Generate a New Example

```bash
npm run create:example artifact-auction ./output/artifact-auction
```

This creates a standalone example with:
- Complete project structure
- Smart contract
- Test suite
- Deployment scripts
- Configuration files
- Documentation

### Generate Documentation

```bash
npm run generate:docs
```

This generates:
- API reference documentation
- Contract documentation
- GitBook configuration
- SUMMARY.md for navigation

## Detailed Usage

### Creating Examples

#### Basic Usage

```bash
npx ts-node scripts/create-fhevm-example.ts <example-name> [output-directory]
```

#### Parameters

- `<example-name>` (required): Name of the example to create
- `[output-directory]` (optional): Output directory path (defaults to `./output/fhevm-<name>`)

#### Available Examples

```bash
# View available examples
npm run help:create
```

Current examples:
- `artifact-auction` - Confidential artifact auction system

#### Examples

```bash
# Create in default location (./output/fhevm-artifact-auction)
npm run create:example artifact-auction

# Create in custom location
npm run create:example artifact-auction ./my-examples/auction

# With absolute path
npx ts-node scripts/create-fhevm-example.ts artifact-auction /home/user/projects/fhevm-auction
```

#### What Gets Generated

```
artifact-auction/
├── contracts/
│   └── ArtifactAuction.sol
├── test/
│   └── ArtifactAuction.ts
├── deploy/
│   └── 001_deploy.ts
├── tasks/
│   └── auction.ts
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
└── [configuration files]
```

#### Next Steps After Generation

```bash
cd output/fhevm-artifact-auction
npm install
npm run compile
npm run test
```

### Generating Documentation

#### Basic Usage

```bash
npx ts-node scripts/generate-docs.ts [options]
```

#### Options

- `--help, -h` - Show help message
- `--all` - Generate all documentation (default)

#### Output

Generates the following files:

- **docs/artifact-auction.md** - Contract documentation
- **docs/api.md** - API reference
- **SUMMARY.md** - GitBook table of contents
- **book.json** - GitBook configuration

#### Documentation Structure

```
docs/
├── artifact-auction.md     # Contract overview
├── api.md                  # API reference
└── examples/
    └── [example files]
```

#### Using Generated Documentation

To serve documentation locally:

```bash
# Install GitBook CLI
npm install -g gitbook-cli

# Serve documentation
gitbook serve

# Output will be in _book directory
# Open http://localhost:4000 in browser
```

### Script Features

#### create-fhevm-example.ts Features

- **Fast Setup**: Copies template and updates configuration
- **Smart Extraction**: Automatically extracts contract names
- **File Organization**: Properly organizes contracts and tests
- **Configuration**: Updates package.json with example metadata
- **Documentation**: Generates appropriate README
- **Ready to Use**: Output is immediately deployable

#### generate-docs.ts Features

- **JSDoc Extraction**: Parses comments from test files
- **API Generation**: Creates API reference from code
- **GitBook Compatible**: Generates GitBook-ready markdown
- **Navigation**: Produces SUMMARY.md for documentation structure
- **Configuration**: Creates book.json for GitBook settings

## Automation Workflow

### Complete Development Workflow

```bash
# 1. Create a new example
npm run create:example my-new-example ./output/my-example

# 2. Navigate to output
cd output/my-example

# 3. Install dependencies
npm install

# 4. Develop and test
npm run compile
npm run test

# 5. Generate documentation
npm run generate:docs

# 6. Test documentation locally
npm install -g gitbook-cli
gitbook serve
```

### Batch Generation

Generate multiple examples:

```bash
# Create script: generate-all-examples.sh
#!/bin/bash
examples=("artifact-auction")

for example in "${examples[@]}"; do
    npm run create:example $example ./output/$example
done
```

## Advanced Usage

### Customizing Generated Examples

After generation, you can customize:

1. **README.md** - Update description and examples
2. **package.json** - Modify dependencies and scripts
3. **hardhat.config.ts** - Adjust network settings
4. **Contracts** - Modify smart contracts
5. **Tests** - Add or update tests

### Creating Custom Examples

To add a new example to the generator:

1. Edit `scripts/create-fhevm-example.ts`
2. Add entry to `EXAMPLES_MAP`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'artifact-auction': { /* ... */ },
  'my-example': {
    contract: 'contracts/MyExample.sol',
    test: 'test/MyExample.ts',
    description: 'Description of my example',
    category: 'basic',
  },
};
```

3. Ensure contract and test files exist
4. Test generation:

```bash
npm run create:example my-example ./output/test
```

### Extending Documentation Generation

To enhance documentation generation:

1. Edit `scripts/generate-docs.ts`
2. Add new documentation types
3. Update `generateDocumentation()` function
4. Add output file generation

Example:

```typescript
// Add new doc type
function generateGlossary(): string {
  return `# Glossary\n\n...`;
}

// Add to main function
const glossary = generateGlossary();
fs.writeFileSync(path.join(docsDir, 'glossary.md'), glossary);
```

## Troubleshooting

### Common Issues

**Issue**: Script not found
```bash
# Solution: Ensure scripts directory exists and has correct permissions
ls -la scripts/
chmod +x scripts/*.ts
```

**Issue**: Output directory already exists
```bash
# Solution: Use different directory or remove existing one
npm run create:example artifact-auction ./output/new-location
```

**Issue**: Documentation not generating
```bash
# Solution: Check file paths and permissions
npm run generate:docs
npm run help:docs
```

**Issue**: Missing dependencies in generated example
```bash
# Solution: Run npm install in generated directory
cd output/fhevm-artifact-auction
npm install
npm run compile
```

### Debug Mode

Enable verbose output:

```bash
# Add debug output to scripts
NODE_DEBUG=* npm run create:example artifact-auction ./output/debug
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Generate Examples

on:
  push:
    branches: [ main ]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run create:example artifact-auction ./output/artifact-auction
      - run: npm run generate:docs
      - uses: actions/upload-artifact@v2
        with:
          name: generated-examples
          path: output/
```

## Performance Tips

### Faster Generation

```bash
# Use npm ci instead of npm install
npm ci

# Parallel generation (if needed)
npm run create:example artifact-auction ./output/example1 &
npm run create:example artifact-auction ./output/example2 &
wait
```

### Reducing Output Size

```bash
# Remove unnecessary files after generation
cd output/fhevm-artifact-auction
npm run clean
rm -rf node_modules
```

## Automation Best Practices

1. **Version Control**: Commit generated examples
2. **Testing**: Run tests on generated examples
3. **Documentation**: Keep docs up to date
4. **Regular Updates**: Regenerate when updating dependencies
5. **CI Integration**: Automate generation in CI/CD

## Resources

- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Development guidelines
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [README.md](README.md) - Main documentation

## Support

For issues or questions:

1. Check this guide
2. Review script source code
3. Check generated examples
4. Open GitHub issue
5. Join community Discord

---

Happy automating!
