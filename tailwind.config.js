module.exports = {
	content: ['./src/**/*.{js,jsx}'],
	theme: {
		fontFamily: {
			sans: ['Inter var', 'Inter', 'sans-serif'],
		},
		extend: {
			gridTemplateRows: {
				'room-layout': '1fr 64px',
				'landing-layout': 'auto 1fr',
				'web-layout': 'auto 1fr auto',
				'participants-layout': 'repeat(auto-fill, minmax(180px, auto))',
			},
			gridTemplateColumns: {
				'card-user-layout': 'auto 1fr auto',
				'participants-layout': 'repeat(auto-fill, minmax(320px, 1fr))',
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
