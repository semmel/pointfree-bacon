import nodeResolve from '@rollup/plugin-node-resolve';

const
	externals = ["semmel-ramda", "@visisoft/staticland", "@visisoft/staticland/maybe", "baconjs"],
	
	config = {
		input: "index.js",
		external: externals,
		output: {
			format: "cjs",
			file: "./dist/cjs/pointfree-bacon.js"
		},
		plugins: [
			nodeResolve()
		]
	};

export default config;
