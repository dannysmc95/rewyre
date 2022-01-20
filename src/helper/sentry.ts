import { statSync } from 'fs';
import { resolve } from 'path';
import { IOptions } from '../interface/options';
import { ILogger } from '../interface/logger';

/**
 * The sentry helper class is used to process and manage sentry events.
 */
export class SentryHelper {

	public isInstalled = false;
	protected sentryNode: any;

	public constructor(protected options: IOptions, protected logger: ILogger) {}

	public async init(): Promise<void> {

		// Check if sentry is installed.
		if (!this.isSentryInstalled()) return;

		// Notify installation found.
		this.logger.verbose('SENTRY', 'Sentry is installed, initializing...');

		try {
			// Import the sentry modules.
			this.sentryNode = await import('@sentry/node');
			await import('@sentry/tracing');

			// Setup sentry node and tracing.
			this.sentryNode.init({
				dsn: this.options.sentry_dsn,
				...this.options.sentry_options,
			});

			// Notify installation completed.
			this.logger.verbose('SENTRY', 'Sentry initialised successfully...');
		} catch(err) {
			this.logger.error('SENTRY', 'Failed to initialize sentry', err as Error);
		}
	}

	public startTransaction(...params: any[]): any {
		if (!this.isInstalled) return;
		return this.sentryNode.startTransaction(...params);
	}

	public captureException(exception: Error): void {
		if (!this.isInstalled) return;
		this.sentryNode.captureException(exception);
	}

	public isSentryInstalled(): boolean {
		try {
			// Define the paths.
			const sentryNodePath = resolve(process.cwd(), './node_modules/@sentry/node');
			const sentryTracingPath = resolve(process.cwd(), './node_modules/@sentry/tracing');

			// Stat both files.
			statSync(sentryNodePath);
			statSync(sentryTracingPath);

			// Installed, set internal variable.
			this.isInstalled = true;

			// Return successful.
			return true;

		} catch(err) {
			return false;
		}
	}
}
