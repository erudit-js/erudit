import { execSync } from 'node:child_process';

console.log('🏗️ Starting sequential build process...');

const packages = ['cog', 'cli', 'bitran-elements'];

for (const pkg of packages) {
    try {
        console.log(`\n📦 Building "${pkg}" package...`);
        execSync(`bun run build`, {
            cwd: `${__dirname}/../packages/${pkg}`,
            stdio: 'inherit',
        });
        console.log(`✅ Successfully built "${pkg}" package`);
    } catch (error) {
        console.error(`❌ Failed to build "${pkg}" package`);
        console.error(error);
        process.exit(1);
    }
}

console.log('\n🎉 All packages built successfully!');
