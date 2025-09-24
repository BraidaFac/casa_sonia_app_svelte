export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["CS.png","favicon.png","fonts/Quicksand-Regular.ttf"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf"},
	_: {
		client: {start:"_app/immutable/entry/start.DucZ2izW.js",app:"_app/immutable/entry/app.BhaU5UVE.js",imports:["_app/immutable/entry/start.DucZ2izW.js","_app/immutable/chunks/B3CtTh1F.js","_app/immutable/chunks/D37he2ZV.js","_app/immutable/chunks/B4tm4b0n.js","_app/immutable/entry/app.BhaU5UVE.js","_app/immutable/chunks/B4tm4b0n.js","_app/immutable/chunks/D37he2ZV.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BuDUvo5C.js","_app/immutable/chunks/C9PGmLv_.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
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
			},
			{
				id: "/api",
				pattern: /^\/api\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_server.ts.js'))
			},
			{
				id: "/api/coeficient",
				pattern: /^\/api\/coeficient\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/coeficient/_server.ts.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/logout/_server.ts.js'))
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
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
