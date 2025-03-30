import { buildApp } from './app';

async function main() {
  const server = buildApp();
  try {
    console.log('Starting serever...');
    await server.listen({
      port: 3000,
      host: '0.0.0.0',
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

main();
