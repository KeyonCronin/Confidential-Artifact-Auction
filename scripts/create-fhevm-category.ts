#!/usr/bin/env ts-node

/**
 * create-fhevm-category - Generate category-based FHEVM example projects
 *
 * Usage: npx ts-node scripts/create-fhevm-category.ts <category> [output-dir]
 *
 * Categories:
 * - basic: Basic FHE operations (counter, arithmetic)
 * - advanced: Advanced examples (auctions, voting)
 * - access-control: Access control patterns
 * - encryption: Encryption and decryption examples
 *
 * Example: npx ts-node scripts/create-fhevm-category.ts basic ./output/basic-examples
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

// Category configuration
interface CategoryConfig {
  name: string;
  description: string;
  examples: string[];
}

// Available categories
const CATEGORIES: Record<string, CategoryConfig> = {
  basic: {
    name: 'Basic FHEVM Examples',
    description: 'Fundamental examples demonstrating basic FHE operations',
    examples: ['counter', 'fhe-counter'],
  },
  advanced: {
    name: 'Advanced FHEVM Examples',
    description: 'Complex examples showing real-world applications',
    examples: ['artifact-auction'],
  },
  'access-control': {
    name: 'Access Control Examples',
    description: 'Examples demonstrating FHE access control patterns',
    examples: [],
  },
  encryption: {
    name: 'Encryption Examples',
    description: 'Examples showing encryption and decryption workflows',
    examples: [],
  },
};

// Example configurations
interface ExampleInfo {
  contract: string;
  test: string;
  description: string;
}

const EXAMPLES: Record<string, ExampleInfo> = {
  counter: {
    contract: 'contracts/Counter.sol',
    test: 'test/Counter.ts',
    description: 'Simple non-encrypted counter for comparison',
  },
  'fhe-counter': {
    contract: 'base-template/contracts/FHECounter.sol',
    test: 'base-template/test/FHECounter.ts',
    description: 'Encrypted counter using FHEVM',
  },
  'artifact-auction': {
    contract: 'contracts/ArtifactAuction.sol',
    test: 'test/ArtifactAuction.ts',
    description: 'Confidential artifact auction system',
  },
};

function copyDirectoryRecursive(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      if (['node_modules', 'artifacts', 'cache', 'coverage', 'types', 'dist', 'fhevmTemp'].includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function generateCategoryReadme(categoryName: string, config: CategoryConfig): string {
  return `# ${config.name}

${config.description}

## Examples Included

${config.examples.map(ex => `- **${ex}**: ${EXAMPLES[ex]?.description || 'Example'}`).join('\n')}

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile All Examples

\`\`\`bash
npm run compile
\`\`\`

### Run All Tests

\`\`\`bash
npm run test
\`\`\`

## Individual Examples

Each example can be found in its respective directory:

${config.examples.map(ex => `- \`examples/${ex}/\``).join('\n')}

## Project Structure

\`\`\`
${categoryName}/
├── examples/
${config.examples.map(ex => `│   ├── ${ex}/\n│   │   ├── contracts/\n│   │   └── test/`).join('\n')}
├── hardhat.config.ts
├── package.json
└── README.md
\`\`\`

## Documentation

For detailed documentation on each example, see the README in each example directory.

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org)
- [Zama Community](https://www.zama.ai/community)

## License

MIT License
`;
}

function createCategory(categoryName: string, outputDir: string): void {
  const rootDir = path.resolve(__dirname, '..');

  if (!CATEGORIES[categoryName]) {
    error(`Unknown category: ${categoryName}\n\nAvailable categories:\n${Object.keys(CATEGORIES).map(k => `  - ${k}`).join('\n')}`);
  }

  const category = CATEGORIES[categoryName];

  info(`Creating category: ${categoryName}`);
  info(`Output directory: ${outputDir}`);

  // Create output directory
  log('\nStep 1: Creating project structure...', Color.Cyan);
  if (fs.existsSync(outputDir)) {
    error(`Output directory already exists: ${outputDir}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'examples'), { recursive: true });

  // Copy base template
  const baseTemplatePath = path.join(rootDir, 'base-template');
  if (fs.existsSync(baseTemplatePath)) {
    ['hardhat.config.ts', 'package.json', 'tsconfig.json', '.gitignore', '.eslintrc.yml', '.prettierrc.yml'].forEach(file => {
      const sourcePath = path.join(baseTemplatePath, file);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, path.join(outputDir, file));
      }
    });
  }
  success('Project structure created');

  // Copy examples
  log('\nStep 2: Copying examples...', Color.Cyan);
  category.examples.forEach(exampleName => {
    const exampleInfo = EXAMPLES[exampleName];
    if (!exampleInfo) {
      log(`Warning: Example ${exampleName} not found`, Color.Yellow);
      return;
    }

    const exampleDir = path.join(outputDir, 'examples', exampleName);
    fs.mkdirSync(exampleDir, { recursive: true });
    fs.mkdirSync(path.join(exampleDir, 'contracts'), { recursive: true });
    fs.mkdirSync(path.join(exampleDir, 'test'), { recursive: true });

    // Copy contract
    const contractPath = path.join(rootDir, exampleInfo.contract);
    if (fs.existsSync(contractPath)) {
      const contractName = path.basename(contractPath);
      fs.copyFileSync(contractPath, path.join(exampleDir, 'contracts', contractName));
      success(`Copied contract: ${contractName}`);
    }

    // Copy test
    const testPath = path.join(rootDir, exampleInfo.test);
    if (fs.existsSync(testPath)) {
      const testName = path.basename(testPath);
      fs.copyFileSync(testPath, path.join(exampleDir, 'test', testName));
      success(`Copied test: ${testName}`);
    }

    // Create example README
    const exampleReadme = `# ${exampleName}

${exampleInfo.description}

## Files

- \`contracts/${path.basename(exampleInfo.contract)}\`
- \`test/${path.basename(exampleInfo.test)}\`

## Running

\`\`\`bash
npm run compile
npm run test
\`\`\`
`;
    fs.writeFileSync(path.join(exampleDir, 'README.md'), exampleReadme);
  });

  // Generate category README
  log('\nStep 3: Generating documentation...', Color.Cyan);
  const readme = generateCategoryReadme(categoryName, category);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('Documentation generated');

  // Update package.json
  const packageJsonPath = path.join(outputDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.name = `fhevm-${categoryName}-examples`;
    packageJson.description = category.description;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Final summary
  log('\n' + '='.repeat(70), Color.Green);
  success(`Category "${categoryName}" created successfully!`);
  log('='.repeat(70), Color.Green);

  log('\nNext steps:', Color.Yellow);
  log(`  cd ${path.relative(process.cwd(), outputDir)}`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');

  log('\nCategory includes:', Color.Cyan);
  category.examples.forEach(ex => {
    log(`  - ${ex}: ${EXAMPLES[ex]?.description}`);
  });
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('FHEVM Category Generator\n', Color.Cyan);
    log('Usage: npx ts-node scripts/create-fhevm-category.ts <category> [output-dir]\n');
    log('Available categories:', Color.Yellow);
    Object.entries(CATEGORIES).forEach(([name, config]) => {
      log(`  ${name}`, Color.Green);
      log(`    ${config.description}`, Color.Reset);
      log(`    Examples: ${config.examples.join(', ')}`, Color.Blue);
    });
    log('\nExample:', Color.Yellow);
    log('  npx ts-node scripts/create-fhevm-category.ts basic ./output/basic-examples\n');
    process.exit(0);
  }

  const categoryName = args[0];
  const outputDir = args[1] || path.join(process.cwd(), 'output', `fhevm-${categoryName}-examples`);

  createCategory(categoryName, outputDir);
}

main();
