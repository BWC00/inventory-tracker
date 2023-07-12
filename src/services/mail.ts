import { createTransport, SendMailOptions, SentMessageInfo, Transporter, TransportOptions } from 'nodemailer';

import { env, mails } from '../config/globals';
// import { logger } from '../config/logger';



/**
 * MailService
 *
 * Service for sending emails
 */
export class MailService {
	private transporter: Transporter = createTransport(env.SMTP as TransportOptions);

	/**
	 * Send email
	 *
	 * @param options Mail options
	 * @param forceSend Force email to be sent
	 * @returns info of sent mail
	 */
	public sendMail(emails: string[], subject: string, text: string): Promise<SentMessageInfo> | void {
		// if (env.NODE_ENV === 'production' || forceSend) {
		// 	return this.transporter.sendMail(options);
		// }
		// logger.info('Emails are only sent in production mode!');

		const options: SendMailOptions = {
			from: mails.sender,
			subject: subject,
			text: text,
			to: emails
		};

		return this.transporter.sendMail(options);
	}
}