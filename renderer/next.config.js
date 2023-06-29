module.exports = {
	experimental: {
		images: {
			layoutRaw: true,
		},
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.target = 'electron-renderer';
		}

		return config;
	},
};
