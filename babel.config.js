module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'@components': './src/components',
					'@interfaces': './src/interfaces/index',
					'@hooks': './src/hooks',
					'@utils': './src/utils',
					'@redux': './src/redux',
				},
			},
		],
	],
};
