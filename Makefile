dev:
	yarn web --tunnel

expo-publish:
	expo publish

netlify-publish:
	expo build:web
	netlify deploy --prod
