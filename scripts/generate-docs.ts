#!/usr/bin/env ts-node

/**
 * generate-docs - Generate GitBook-compatible documentation from code annotations
 *
 * Usage: npx ts-node scripts/generate-docs.ts [--all]
 *
 * This script:
 * - Extracts JSDoc comments from test files
 * - Generates documentation from code structure
 * - Creates GitBook-compatible markdown files
 */

import * as fs from 'fs';
import * as path from 'path';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`Success: ${message}`, Color.Green);
}

function info(message: string): void {
  log(`Info: ${message}`, Color.Blue);
}

// Extract JSDoc comments from test file
interface TestDescription {
  title: string;
  description: string;
  context?: string;
}

function extractTestDescriptions(filePath: string): TestDescription[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const descriptions: TestDescription[] = [];

  // Match describe blocks
  const describeRegex = /describe\(['"`](.*?)['"`],\s*function\s*\(\)/g;
  let match;

  while ((match = describeRegex.exec(content)) !== null) {
    const context = match[1];

    // Extract JSDoc comments before describe blocks
    const beforeContent = content.substring(0, match.index);
    const jsDocRegex = /\/\*\*[\s\S]*?\*\//g;
    const jsDocMatches = [...beforeContent.matchAll(jsDocRegex)];

    if (jsDocMatches.length > 0) {
      const lastJsDoc = jsDocMatches[jsDocMatches.length - 1][0];
      const lines = lastJsDoc
        .replace(/\/\*\*|^\s*\*\/$/gm, '')
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\s*\*\s?/, ''))
        .join('\n');

      descriptions.push({
        title: context,
        description: lines,
        context,
      });
    }
  }

  return descriptions;
}

// Generate documentation for a contract
function generateContractDoc(contractName: string, contractPath: string, testPath: string): string {
  const contractContent = fs.readFileSync(contractPath, 'utf-8');
  const testDescriptions = extractTestDescriptions(testPath);

  let doc = `# ${contractName}\n\n`;

  // Extract contract description from JSDoc
  const jsDocMatch = contractContent.match(/\/\/\/\s*(.*?)\n/);
  if (jsDocMatch) {
    doc += `${jsDocMatch[1]}\n\n`;
  }

  // Add contract information
  doc += `## Overview\n\n`;
  doc += `**File:** \`contracts/${contractName}.sol\`\n\n`;

  // Add test information
  if (testDescriptions.length > 0) {
    doc += `## Functionality\n\n`;

    testDescriptions.forEach(test => {
      doc += `### ${test.title}\n\n`;
      doc += `${test.description}\n\n`;
    });
  }

  // Extract state variables and functions
  const stateVarRegex = /^\s*(public|private|internal|protected)?\s*(\w+)\s+(\w+);/gm;
  const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*(public|external|internal|private)?\s*(view|pure)?\s*(returns\s*\([^)]*\))?/g;

  doc += `## Contract Structure\n\n`;

  doc += `### State Variables\n\n`;
  let hasStateVars = false;
  let varMatch;
  const varRegex = /^\s*(public|private)?\s*(\w+)\s+(\w+)/gm;
  while ((varMatch = varRegex.exec(contractContent)) !== null) {
    hasStateVars = true;
    doc += `- \`${varMatch[2]} ${varMatch[3]}\`\n`;
  }
  if (!hasStateVars) {
    doc += 'No public state variables.\n';
  }

  doc += `\n### Functions\n\n`;
  let hasFunctions = false;
  let funcMatch;
  while ((funcMatch = functionRegex.exec(contractContent)) !== null) {
    hasFunctions = true;
    const funcName = funcMatch[1];
    const visibility = funcMatch[2] || 'internal';
    doc += `- \`${funcName}\` (${visibility})\n`;
  }
  if (!hasFunctions) {
    doc += 'No public functions.\n';
  }

  doc += `\n## Testing\n\n`;
  doc += `Run tests with:\n\n`;
  doc += `\`\`\`bash\nnpm run test\n\`\`\`\n\n`;

  return doc;
}

// Generate SUMMARY.md for GitBook
function generateSummary(): string {
  let summary = `# Summary\n\n`;
  summary += `## Introduction\n\n`;
  summary += `* [Introduction](README.md)\n\n`;

  summary += `## Examples\n\n`;
  summary += `* [Artifact Auction](docs/artifact-auction.md)\n\n`;

  summary += `## Development\n\n`;
  summary += `* [Developer Guide](DEVELOPER_GUIDE.md)\n`;
  summary += `* [API Reference](docs/api.md)\n`;

  return summary;
}

// Main documentation generation
function generateDocumentation(): void {
  log('Generating documentation...', Color.Cyan);

  const rootDir = process.cwd();
  const docsDir = path.join(rootDir, 'docs');
  const contractPath = path.join(rootDir, 'contracts', 'ArtifactAuction.sol');
  const testPath = path.join(rootDir, 'test', 'ArtifactAuction.ts');

  // Create docs directory
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Generate contract documentation
  if (fs.existsSync(contractPath) && fs.existsSync(testPath)) {
    const doc = generateContractDoc('ArtifactAuction', contractPath, testPath);
    fs.writeFileSync(path.join(docsDir, 'artifact-auction.md'), doc);
    success('Generated artifact-auction.md');
  }

  // Generate API reference
  const apiDoc = `# API Reference

## ArtifactAuction Contract

### Core Functions

#### createAuction
Creates a new artifact auction.

\`\`\`solidity
function createAuction(
    string memory _name,
    string memory _description,
    string memory _category,
    uint256 _minimumBid,
    uint256 _auctionDuration,
    uint256 _yearCreated,
    string memory _provenance
) external returns (uint32)
\`\`\`

#### authenticateArtifact
Authenticates an artifact in an auction.

\`\`\`solidity
function authenticateArtifact(uint32 auctionId)
    external
    onlyAuthenticator
\`\`\`

#### placeBid
Places an encrypted bid on an auction.

\`\`\`solidity
function placeBid(uint32 auctionId, uint64 _bidAmount)
    external
    auctionExists(auctionId)
    auctionActive(auctionId)
\`\`\`

#### endAuction
Ends an auction and requests bid decryption.

\`\`\`solidity
function endAuction(uint32 auctionId) external
\`\`\`

### View Functions

- \`getAuctionInfo(uint32 auctionId)\` - Get auction details
- \`getArtifactDetails(uint32 auctionId)\` - Get artifact information
- \`getBidStatus(uint32 auctionId, address bidder)\` - Get bid status
- \`getAuctionResults(uint32 auctionId)\` - Get auction results
- \`getActiveAuctions()\` - Get all active auction IDs

### Events

- \`AuctionCreated\` - Emitted when auction is created
- \`ConfidentialBidPlaced\` - Emitted when bid is placed
- \`AuctionEnded\` - Emitted when auction ends
- \`ArtifactAuthenticated\` - Emitted when artifact is authenticated
- \`EarningsWithdrawn\` - Emitted when seller withdraws earnings
`;

  fs.writeFileSync(path.join(docsDir, 'api.md'), apiDoc);
  success('Generated api.md');

  // Generate SUMMARY for GitBook
  const summary = generateSummary();
  fs.writeFileSync(path.join(rootDir, 'SUMMARY.md'), summary);
  success('Generated SUMMARY.md');

  // Generate book.json configuration
  const bookConfig = {
    root: './',
    structure: {
      readme: 'README.md',
      summary: 'SUMMARY.md',
    },
  };

  fs.writeFileSync(path.join(rootDir, 'book.json'), JSON.stringify(bookConfig, null, 2));
  success('Generated book.json');

  log('\n' + '='.repeat(60), Color.Green);
  success('Documentation generated successfully');
  log('='.repeat(60), Color.Green);

  log('\nGenerated files:', Color.Yellow);
  log('  - docs/artifact-auction.md');
  log('  - docs/api.md');
  log('  - SUMMARY.md');
  log('  - book.json');

  log('\nTo serve documentation locally:', Color.Cyan);
  log('  npm install -g gitbook-cli');
  log('  gitbook serve');
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args[0] === '--help' || args[0] === '-h') {
    log('Documentation Generator\n', Color.Cyan);
    log('Usage: npx ts-node scripts/generate-docs.ts [options]\n');
    log('Options:', Color.Yellow);
    log('  --help, -h     Show this help message');
    log('  --all          Generate all documentation\n');
    process.exit(0);
  }

  generateDocumentation();
}

main();
