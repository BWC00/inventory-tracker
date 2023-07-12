import 'reflect-metadata';

// Set env variables from .env file
import { config } from 'dotenv';
config();

import express from 'express';

import { createServer, Server as HttpServer } from 'http';

import { env } from './config/globals';
import { logger } from './config/logger';

import { Server } from './api/server';
import { RedisService } from './services/redis';

(async function main() {
	try {
		// Connect redis
		RedisService.connect();

		// Init express server
		const app: express.Application = new Server().app;
		const server: HttpServer = createServer(app);

		// Start express server
		server.listen(env.NODE_PORT);

		server.on('listening', () => {
			logger.info(`node server is listening on port ${env.NODE_PORT} in ${env.NODE_ENV} mode`);
		});

		server.on('close', () => {
			RedisService.disconnect();
			logger.info('node server closed');
		});
	} catch (err) {
		logger.error(err.stack);
	}
})();
