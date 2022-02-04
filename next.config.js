const config = {
	i18n: {
		locales: ['ru'],
		defaultLocale: 'ru',
	},
}

module.exports =
	process.env.ANALYZE === 'true'
		? // eslint-disable-next-line @typescript-eslint/no-var-requires
		  require('@next/bundle-analyzer')({ enabled: true })(config)
		: config
