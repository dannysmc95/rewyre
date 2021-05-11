import { AbstractProvider } from '../abstract/provider';
import { pbkdf2, randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';
import { Provide } from '../decorator/provide';

/**
 * The crypto provider offers various cryptographic operations, these are
 * built using the built in Crypto library and offer a series of simple to use 
 */
@Provide('crypto', 'single')
export class CryptoProvider extends AbstractProvider {

	protected hash_iterations = 1000;
	protected hash_salt_length = 32;
	protected hash_key_length = 64;
	protected hash_algorithm = 'sha512';
	protected crypt_algorithm = 'aes-256-cbc';

	/**
	 * This will take a password and use the crypto method: pbkdf2, to hash the
	 * password using a series of default high secure settings and using the 
	 * SHA512 algorithm.
	 * 
	 * @param password The password to hash.
	 */
	public async hashPassword(password: string): Promise<string> {
		const salt: string = randomBytes(this.hash_salt_length).toString('hex');
		const hashed_password: string = await this.pbkdf2(password, salt, this.hash_iterations, this.hash_key_length, this.hash_algorithm);
		return `${hashed_password}:${salt}:${this.hash_iterations}:${this.hash_salt_length}:${this.hash_key_length}:${this.hash_algorithm}`;
	}

	/**
	 * This method will take both the user provided password, and the existing
	 * password hash and will validate whether they are the same, will return
	 * true or false depending on the outcome.
	 * 
	 * @param password The user provided password.
	 * @param hashed_password The already hashed password.
	 */
	public async validatePassword(password: string, hashed_password: string): Promise<boolean> {
		const [ hashed, salt, iterations,, key_length, hash_algorithm ] = hashed_password.split(':');
		const pass_hashed: string = await this.pbkdf2(password, salt, parseInt(iterations), parseInt(key_length), hash_algorithm);
		if (hashed === pass_hashed) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * This function will take a key and data and encrypt the contents using the
	 * AES-256-CBC algorithm, The IV is attached to the end of the data string.
	 * 
	 * @param key The encryption key to use.
	 * @param data The data as a string to encrypt.
	 */
	public async encrypt(key: string, data: string): Promise<string> {
		const key_hash: string = createHash('md5').update(key).digest('hex');
		const iv: string = Buffer.from(randomBytes(16)).toString('hex').slice(0, 16);
		const cipher = createCipheriv(this.crypt_algorithm, key_hash, iv);
		let encrypted: any = cipher.update(data);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return `${encrypted.toString('hex')}:${iv}`;
	}

	/**
	 * This function will take a key and data and decrypt the contents using the
	 * AES-256-CBC algorithm, the IV is taken from the data string itself.
	 * 
	 * @param key The decryption key to use.
	 * @param data The data as a string to decrypt.
	 */
	public async decrypt(key: string, data: string): Promise<string> {
		const [ encrypted, iv ] = data.split(':');
		const key_hash: string = createHash('md5').update(key).digest('hex');
		const decipher = createDecipheriv(this.crypt_algorithm, key_hash, iv);
		let decrypted: any = decipher.update(Buffer.from(encrypted, 'hex'));
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}

	/**
	 * This function is the same pbkdf2 method from the Crypto library but has
	 * been wrapped in to a promise so that it can be used alongside async/await.
	 * 
	 * @param password The password to hash.
	 * @param salt The salt to hash with the password.
	 * @param iterations The iteration count.
	 * @param key_length The length of the key.
	 * @param digest Which algorithm to use.
	 */
	protected async pbkdf2(password: string, salt: string, iterations: number, key_length: number, digest: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			pbkdf2(password, salt, iterations, key_length, digest, (err: any, derivedKey: any) => {
				if (err) reject(err);
				resolve(derivedKey.toString('hex'));
			});
		});
	}
}