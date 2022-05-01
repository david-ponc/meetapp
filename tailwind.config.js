module.exports = {
	content: ['./src/**/*.{js,jsx}'],
	theme: {
		fontFamily: {
			sans: ['Inter var', 'Inter', 'sans-serif'],
		},
		extend: {
			gridTemplateRows: {
				'room-layout': '1fr auto',
				'landing-layout': 'auto 1fr',
				'web-layout': 'auto 1fr auto',
			},
			gridTemplateColumns: {
				'card-user-layout': 'auto 1fr auto',
				'participants-layout': 'repeat(auto-fit, minmax(320px, 1fr))',
			},
			gridAutoRows: {
				participants: '1fr',
			},
			transitionProperty: {
				height: 'height',
			},
			backgroundColor: {
				'participant-gradient': 'linear-gradient(trasnparent 0%, #000000 100%)',
			},
		},
	},
	plugins: [],
};
