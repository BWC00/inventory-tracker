import { createTransport, SendMailOptions, SentMessageInfo, Transporter, TransportOptions } from 'nodemailer';

import { env, mails } from '../config/globals';


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
	public sendMail(email: string, subject: string, text: string): Promise<SentMessageInfo> | void {

		const options: SendMailOptions = {
			from: mails.sender,
			subject: subject,
			text: text,
			to: email
		};

		return this.transporter.sendMail(options);
	}
}