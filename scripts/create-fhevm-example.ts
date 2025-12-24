#!/usr/bin/env ts-node

/**
 * create-fhevm-example - CLI tool to generate standalone FHEVM example repositories
 *
 * Usage: npx ts-node scripts/create-fhevm-example.ts <example-name> [output-dir]
 *
 * Example: npx ts-node scripts/create-fhevm-example.ts artifact-auction ./output/artifact-auction
 */

import * as fs from 'fs';
import * as path from 'path';

// Terminal color codes
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

// Example configuration interface
interface ExampleConfig {
  contract: string;
  test: string;
  description: string;
  category: string;
}

// Available examples map
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'artifact-auction': {
    contract: 'contracts/ArtifactAuction.sol',
    test: 'test/ArtifactAuction.ts',
    description: 'Confidential artifact auction with encrypted bids and authentication',
    category: 'advanced',
  },
};

function copyDirectoryRecursive(source: string, destination: string, skipFiles: string[] = []): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach(item => {
    if (skipFiles.includes(item)) {
      return;
    }

    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      if (['node_modules', 'artifacts', 'cache', 'coverage', 'types', 'dist', 'fhevmTemp'].includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath, skipFiles);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function getContractName(contractPath: string): string | null {
  const content = fs.readFileSync(contractPath, 'utf-8');
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : null;
}

function updatePackageJson(outputDir: string, exampleName: string, description: string): void {
  const packageJsonPath = path.join(outputDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.name = `fhevm-${exampleName}`;
  packageJson.description = description;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function generateReadme(exampleName: string, description: string, contractName: string): string {
  return `# FHEVM Example: ${exampleName}

${description}

## Quick Start

### Installation

\`\`\`bash
npm install
npm run compile
npm run test
\`\`\`

## Contract

Main contract: \`${contractName}\` in \`contracts/${contractName}.sol\`

## Documentation

- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Hardhat](https://hardhat.org)

## License

MIT License
`;
}

function createExample(exampleName: string, outputDir: string): void {
  const rootDir = path.resolve(__dirname, '..');

  if (!EXAMPLES_MAP[exampleName]) {
    error(`Unknown example: ${exampleName}`);
  }

  const example = EXAMPLES_MAP[exampleName];
  const contractPath = path.join(rootDir, example.contract);
  const testPath = path.join(rootDir, example.test);

  if (!fs.existsSync(contractPath)) {
    error(`Contract not found: ${example.contract}`);
  }
  if (!fs.existsSync(testPath)) {
    error(`Test not found: ${example.test}`);
  }

  info(`Creating example: ${exampleName}`);

  log('\nCopying template...', Color.Cyan);
  if (fs.existsSync(outputDir)) {
    error(`Directory exists: ${outputDir}`);
  }

  copyDirectoryRecursive(rootDir, outputDir, ['scripts']);
  success('Template copied');

  const contractName = getContractName(contractPath);
  if (!contractName) {
    error('Could not extract contract name');
  }

  log('\nUpdating configuration...', Color.Cyan);
  updatePackageJson(outputDir, exampleName, example.description);
  success('Configuration updated');

  log('\nGenerating documentation...', Color.Cyan);
  const readme = generateReadme(exampleName, example.description, contractName);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('Documentation generated');

  log('\n' + '='.repeat(60), Color.Green);
  success(`Example created: ${exampleName}`);
  log('='.repeat(60), Color.Green);

  log('\nNext steps:', Color.Yellow);
  log(`  cd ${path.relative(process.cwd(), outputDir)}`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    log('FHEVM Example Generator\n', Color.Cyan);
    log('Usage: npx ts-node scripts/create-fhevm-example.ts <name> [output-dir]\n');
    log('Available examples:', Color.Yellow);
    Object.entries(EXAMPLES_MAP).forEach(([name, info]) => {
      log(`  ${name}`, Color.Green);
      log(`    ${info.description}`, Color.Reset);
    });
    process.exit(0);
  }

  const exampleName = args[0];
  const outputDir = args[1] || path.join(process.cwd(), 'output', `fhevm-${exampleName}`);

  createExample(exampleName, outputDir);
}

main();
