export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "uncertainty-viz-presentation/_app",
	assets: new Set([".nojekyll","robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.CtWOJdE0.js",app:"_app/immutable/entry/app.C6sZLRUE.js",imports:["_app/immutable/entry/start.CtWOJdE0.js","_app/immutable/chunks/CqFxFwSZ.js","_app/immutable/chunks/jjtasVTq.js","_app/immutable/chunks/ctWN7fAZ.js","_app/immutable/entry/app.C6sZLRUE.js","_app/immutable/chunks/jjtasVTq.js","_app/immutable/chunks/D4btg0ZI.js","_app/immutable/chunks/CuOopork.js","_app/immutable/chunks/ctWN7fAZ.js","_app/immutable/chunks/ggvv4uf1.js","_app/immutable/chunks/BhVooflF.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
