module.exports = {
	extends: [
		'@lynxtaa/eslint-config',
		'@lynxtaa/eslint-config/requires-typechecking',
		'next',
	],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
}
