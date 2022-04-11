const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				gray: colors.trueGray,
				sky: colors.sky,
				orange: colors.orange,
				indigo: colors.indigo,
				green: colors.green,
				rose: colors.rose,
				yellow: colors.yellow
			}
		}
	},
	variants: {
		extend: {
			display: ["group-hover"],
			cursor: ["disabled"],
			backgroundColor: ["disabled"],
			borderWidth: ["hover"],
			blur: ["hover"]
		}
	},
	plugins: []
};
