import acl from 'acl';
import { readFileSync } from 'fs';
import { logger } from './logger';

const policy = new acl(new acl.memoryBackend());

// Read permissions from combined policies
try {
	const policies = JSON.parse(readFileSync('./dist/output/policies.combined.json', 'utf-8'));
	policy.allow([
		{
			allows: policies.Admin,
			roles: ['admin']
		},
		{
			allows: policies.User,
			roles: ['counter']
		}
	]);
} catch (error) {
	logger.error(error.message);
}

export { policy };
