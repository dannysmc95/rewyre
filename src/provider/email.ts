import { AbstractProvider } from '../abstract/provider';
import { Provide } from '../decorator/provide';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { IOptions } from '../interface/options';
import { Logger } from '../module/logger';

@Provide('email', 'shared')
/**
 * The email provider is built to serve any email requirements for your
 * REST application, by default we use nodemailer as the main mail engine
 * and settings are defined inside of the IOptions object.
 */
export class EmailProvider extends AbstractProvider {

	protected options!: IOptions;
	protected transport: Transporter;
	protected logger: Logger;
	protected verified: boolean;

	/**
	 * Creates an instance of the email provider.
	 */
	constructor() {
		super();
		this.verified = false;
		this.logger = new Logger();

		// Build the options.
		const options: any = this.buildOptions();

		// Validate that email is enabled.
		if (options === false) throw new Error('Email is disabled.');

		// Build the transport object.
		this.transport = createTransport(options);

		// Test the settings.
		this.verifySettings();
	}

	/**
	 * Attempts to build the options for node mailer, based on
	 * the information given from the framework settings.
	 */
	protected buildOptions(): any {
		if (!this.options.email_enable) return false;
		return {
			host: this.options.email_host,
			port: this.options.email_port,
			pool: this.options.email_opt_pool,
			secure: this.options.email_opt_secure,
			auth: this.options.email_auth,
			tls: this.options.email_tls,
		}
	}

	/**
	 * Will take the transport instance and attempt to verify the
	 * server settings and make sure it can work, if successful it
	 * will notify the console, on failure, it will only throw an
	 * error message and not fail.
	 */
	protected verifySettings(): void {
		this.transport.verify((err: Error | null) => {
			if (err) {
				this.logger.error('EMAIL', `There was an error with validating the server settings, message: ${err.message}.`, err);
			} else {
				this.logger.notice('EMAIL', 'The email provider was successfully verified.');
			}
		});
	}

	/**
	 * Called on every request to the transport and will notify the
	 * console of the failure, by throwing an error.
	 */
	protected isVerified(): void {
		if (!this.verified) {
			throw new Error('The given transport failed verification and therefore is not available.');
		}
	}

	/**
	 * This function will send an email using the message as the send
	 * mail options object.
	 * 
	 * @param message The send mail object.
	 */
	public async send(message: SendMailOptions): Promise<any> {
		return await new Promise((resolve, reject) => {
			this.transport.sendMail(message, (err: Error | null, info: any) => {
				if (err) reject(err);
				resolve(info);
			});
		});
	}
}