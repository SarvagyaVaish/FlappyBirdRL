var Ω = (function() {

	"use strict";

	var preloading = true,
		pageLoaded = false,
		assetsToLoad = 0,
		maxAssets = 0,
		timers = [];

	return {

		evt: {
			onloads: [],
			progress: [],
			onload: function(func) {
				if (!pageLoaded) {
					this.onloads.push(func);
				} else {
					// Page already loaded... so call it up.
					func();
				}
			}
		},

		env: {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		},

		preload: function (name) {

			if (!preloading) {
				return function () {
					// console.log("preloading finished!", name);
				};
			}

			maxAssets = Math.max(++assetsToLoad, maxAssets);

			return function () {

				assetsToLoad -= 1;

				Ω.evt.progress.map(function (p) {
					return p(assetsToLoad, maxAssets);
				});

				if (assetsToLoad === 0 && pageLoaded) {
					if (!preloading) {
						console.error("Preloading finished (onload called) multiple times!");
					}

					preloading = false;
					Ω.evt.onloads.map(function (o) {
						o();
					});
				}

			};
		},

		pageLoad: function () {

			pageLoaded = true;

			if (maxAssets === 0 || assetsToLoad === 0) {
				// No assets to load, so fire onload
				preloading = false;
				Ω.evt.onloads.map(function (o) {
					o();
				});
			}

		},

		timers: {

			add: function (timer) {

				timers.push(timer);

			},

			tick: function () {

				timers = timers.filter(function (t) {

					return t.tick();

				});

			}

		},

		urlParams: (function () {
			var params = {},
				match,
				pl = /\+/g,  // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
				query = window.location.search.substring(1);

			while (match = search.exec(query)) {
			   params[decode(match[1])] = decode(match[2]);
			}

			return params;
		}())

	};

}());

// Polyfills
Array.isArray || (Array.isArray = function (a){ return '' + a !== a && {}.toString.call(a) == '[object Array]' });
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

