// Environment variables imported from .env file
export const env = {
	REDIS_URL: process.env.REDIS_URL,
	NODE_ENV: process.env.NODE_ENV || 'development',
	NODE_PORT: process.env.NODE_PORT || process.env.PORT || 3000,
	DOMAIN: process.env.DOMAIN,
	SMTP: {
		auth: {
			pass: process.env.SMTP_PASSWORD || '',
			user: process.env.SMTP_USERNAME || ''
		},
		host: process.env.SMTP_HOST || '',
		port: process.env.SMTP_PORT || '',
		tls: {
			rejectUnauthorized: false
		}
	}
};

// Used as value for 'from' field for sending emails
export const mails = {
	sender: process.env.SMTP_SENDER || "shaki2632@gmail.com"
};
