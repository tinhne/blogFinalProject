import { buildApp } from './app';

async function server() {
  const app = await buildApp();
  try {
    console.log('Starting serever...');
    app.listen({
      port: 3000,
      host: '0.0.0.0',
    });
  } catch (error) {
    app.log.error(error);
    // console.error('Error starting server:', error);
    process.exit(1);
  }
}

server();
