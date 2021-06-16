#!/usr/bin/env node

console.log(`Rewyre CLI V0.1`);

// Require libraries.
const originalPackage = require('../package.json');
const spawn = require('child_process').spawn;
const resolve = require('path').resolve;
const { mkdirSync, writeFileSync } = require('fs');

// Get the process args and package.
const rawname = process.argv.pop();
const name = rawname.indexOf('/usr/bin') === -1 ? rawname.replace(/[^\w\s\-]/gi, '') : 'rewyre-project';

// Define the file structures.
const folderlist = ['src', 'src/controller'];
const filelist = {};

// Define our base package file.
filelist['package.json'] = `{
	"name": "${name}",
	"version": "0.1.0",
	"description": "A rewyre application.",
	"main": "dist/application.js",
	"scripts": {
		"build": "rm -rf lib/ && node_modules/.bin/tsc",
		"lint": "node_modules/.bin/eslint . --ext .ts",
		"dev": "ENV=dev node -r ts-node/register --max_old_space_size=2048 ./src/application.ts",
		"start": "ENV=prod node --max_old_space_size=2048 ./dist/application.js"
	},
	"author": "Someone <someone@somewhere.com> (https://somewhere.com/)",
	"license": "UNLICENSED",
	"dependencies": {
		"rewyre": "^${originalPackage.version}"
	},
	"devDependencies": {
		"@types/node": "^15.12.2",
		"@typescript-eslint/eslint-plugin": "^4.27.0",
		"@typescript-eslint/parser": "^4.27.0",
		"eslint": "^7.28.0",
		"ts-node": "^10.0.0",
		"typescript": "^4.3.2"
	}
}
`;

// Create our files.
filelist['eslintrc.js'] = `module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	env: {
		node: true,
		es6: true,
		es2017: true,
		es2020: true,
		es2021: true
	},
	globals: {
		'__APP_VERSION__': true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		'ecmaVersion': 2020,
		'sourceType': 'module'
	},
	plugins: [
		'@typescript-eslint/eslint-plugin'
	],
	rules: {
		'@typescript-eslint/interface-name-prefix': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-this-alias': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-unused-vars': ['error', {
			'vars': 'all',
			'args': 'after-used',
			'ignoreRestSiblings': false
		}],
		'semi': ['error', 'always', { 'omitLastInOneLineBlock': true}],
		'no-useless-escape': 2,
		'handle-callback-err': 2,
		'no-fallthrough': 2,
		'no-new-require': 2,
		'max-len': [2, 240],
		'camelcase': 0,
		'require-jsdoc': 0,
		'valid-jsdoc': 0,
		'prefer-spread': 1,
		'prefer-rest-params': 1,
		'linebreak-style': 0,
		'quote-props':[0, 'as-needed'],
		'no-prototype-builtins': 0,
		'@typescript-eslint/no-useless-constructor': ['error'],
		'@typescript-eslint/explicit-member-accessibility': ['error'],
		'@typescript-eslint/camelcase': 0,
		'@typescript-eslint/ban-types': ['error', {
			'types': {
				'Function': false,
			},
			'extendDefaults' : true,
		}],
		'@typescript-eslint/naming-convention': ['error',
			{ selector: 'default', format: ['PascalCase', 'camelCase', 'snake_case', 'UPPER_CASE'] },
			{ selector: 'function', format: ['PascalCase', 'camelCase'], leadingUnderscore: 'forbid' },
			{ selector: 'variable', format: ['snake_case', 'camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
			{ selector: 'memberLike', format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'], leadingUnderscore: 'allow' }
		],
		'no-trailing-spaces': ['error', {
			ignoreComments: true,
			skipBlankLines: false
		}],
		'space-before-function-paren': ['error', {
			anonymous: 'never',
			named: 'never',
			asyncArrow: 'always',
		}],
		'padded-blocks': 0,
		'indent': ['error', 'tab', {
			SwitchCase: 1,
		}],
		'no-tabs': 0,
		'no-useless-return': 0,
		'comma-dangle': ['error', {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always',
			functions: 'always-multiline',
		}],
		'quotes': ['error', 'single'],
		'keyword-spacing': ['error', {
			overrides: {
				catch: {
					before: true,
					after: false,
				},
			},
		}],
		'array-bracket-spacing': 0,
		'generator-star-spacing': 0,
		'one-var': 0,
		'no-mixed-operators': 0,
		'eol-last': ['error', 'always'],
	}
}
`;

filelist['.eslintignore'] = `node_modules
coverage/
lib/
.prettierrc
.vscode/
.circleci/
`;

filelist['tsconfig.json'] = `{
	"compilerOptions": {
		"target": "es6",
		"module": "commonjs",
		"outDir": "./dist",
		"rootDir": "./src",
		"declaration": true,
		"sourceMap": true,
		"noImplicitAny": false,
		"noImplicitThis": false,
		"moduleResolution": "node",
		"strict": true,
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true,
		"removeComments": false,
		"resolveJsonModule": true,
		"types": ["node"],
		"typeRoots": [ "node_modules/@types" ]
	},
	"exclude": [ "test", "dist" ]
}
`;

filelist['readme.md'] = `# ${name}

A blank rewyre project.

To run your application in development mode:
\`\`\`
npm run dev
\`\`\`

To lint your application:
\`\`\`
npm run lint
\`\`\`

To build your application:
\`\`\`
npm run build
\`\`\`

To start your application in production mode:
\`\`\`
npm start
\`\`\`
`;

filelist['src/application.ts'] = `import { Framework, Drivers } from 'rewyre';
import { HomeController } from './controller/home';

(async () => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		port: 8080,
		database: true,
		log_levels: ['info', 'warn', 'error', 'verbose', 'debug'],
		databases: [
			{
				unique: 'main',
				host: 'localhost',
				port: 27017,
				name: '${name}-development',
				driver: Drivers.MONGO,
				default: true,
			},
		],
	});

	// Register classes.
	application.register([
		HomeController,
	]);

	// Start the server.
	await application.start();
})();
`;

filelist['src/controller/home.ts'] = `import { Controller, AbstractController, Route, IReturn } from 'rewyre';

@Controller('/', 'home')
export class HomeController extends AbstractController {

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		return { status: 200, content: 'Hello, World!' };
	}
}
`;

// Now create folders.
console.log(`-> Creating directories...`);
const baseFolder = process.cwd();
mkdirSync(resolve(baseFolder, `./${name}`));
folderlist.forEach(foldername => {
	mkdirSync(resolve(baseFolder, `./${name}`, `./${foldername}`));
});

// Now loop and create files.
console.log(`-> Creating files...`);
Object.keys(filelist).forEach(path => {
	writeFileSync(resolve(baseFolder, `./${name}`, `./${path}`), filelist[path], 'utf-8');
});

// Now run install.
console.log(`-> Running NPM install...`);
const npmInstall = spawn('npm', ['install'], { cwd: resolve(baseFolder, `./${name}`) });
npmInstall.stdout.on('data', data => { console.log(data.toString('utf-8')) });
npmInstall.stderr.on('data', data => { console.error(data.toString('utf-8')) });
npmInstall.on('exit', code => {

	// On exit.
	if (code.toString() !== '0') {
		console.error(`Process exited with code ${code.toString()}.`);
	}

	// Now notify it's done.
	if (code.toString() === '0') {
		console.log('Setup was completed.');
	}
});
