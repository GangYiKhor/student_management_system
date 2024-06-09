module.exports = {
	darkMode: 'class',
	content: [
		'./renderer/pages/**/*.{js,ts,jsx,tsx}',
		'./renderer/components/**/*.{js,ts,jsx,tsx}',
		'./renderer/layouts/**/*.{js,ts,jsx,tsx}',
		'./renderer/utils/tailwindClass/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				bglight: '#FAFAFA',
				bgdark: '#2A2E32',
			},
		},
	},
	plugins: [],
};
