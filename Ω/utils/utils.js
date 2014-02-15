(function (Ω) {

	"use strict";

	Ω.utils = {

		rand: function (max, min) {

			max = max || 1;
			min = min || 0;

			return Math.floor(Math.random() * (max - min)) + min;

		},

		oneIn: function (max) {

			return this.rand(max) === 1;

		},

		rnd: {

			seed: 42,

			rand: function(max, min) {

				max = max || 1;
				min = min || 0;

				this.seed = (this.seed * 9301 + 49297) % 233280;

				return ((this.seed / 233280) * (max - min) + min) | 0;
			}
		},

		// This gets overwritten by game.now
		// To use game time, not real-world time
		now: function () {

			return Date.now();

		},

		since: function (time) {

			return this.now() - time;

		},

		toggle: function (time, steps, offset) {

			return ((this.now() + (offset || 0)) / time) % steps >> 0;

		},

		dist: function (a, b) {

			var dx = a.x ? a.x - b.x : a[0] - b[0],
				dy = a.y ? a.y - b.y : a[1] - b[1];

			return Math.sqrt(dx * dx + dy * dy);

		},

		center: function (e, zoom) {

			zoom = zoom || 1;

			return {
				x: e.x + e.w / zoom / 2,
				y: e.y + e.h / zoom / 2
			};

		},

		degToRad: function (deg) {

			return deg * Math.PI / 180;

		},

		radToDeg: function (rad) {

			return rad * 180 / Math.PI;

		},

		angleBetween: function (a, b) {

			var dx = a.x - b.x,
				dy = a.y - b.y,
				angle = Math.atan2(dy, dx);

			return angle;// % Math.PI;

		},

		snap: function(value, snapSize) {

			return Math.floor(value / snapSize) * snapSize;

		},

		snapRound: function(value, snapSize) {

			var steps = value / snapSize | 0,
				remain = value - (steps * snapSize),
				rounder = remain > (snapSize / 2) ? Math.ceil : Math.floor;

			return rounder(value / snapSize) * snapSize;

		},

		clamp: function(val, min, max) {

			return Math.max(min, Math.min(max, val));

		},

		ratio: function (start, finish, amount) {

			return this.clamp((amount - start) / (finish - start), 0, 1);

		},

		lerp: function (start, finish, amount) {

			return amount * this.ratio(start, finish, amount);

		},

		lerpPerc: function (start, finish, perc) {

			return ((finish - start) * perc) + start;

		},

		smoothstep: function (start, finish, amount) {

			var x = this.ratio(start, finish, amount);

			return amount * (x * x * x * (x * (x * 6 - 15) + 10)); //(x*x*(3 - 2*x));
		},

		neighbours: function (radius, cb, onlyOuterRing) {

			var j, i;

			for (j = -radius; j <= radius; j++) {
				for(i = -radius; i <= radius; i++) {
					if(onlyOuterRing && (Math.abs(i) !== radius && Math.abs(j) !== radius)){
						continue;
					}
					cb && cb(i, j);
				}
			}

		},

		constrain: function (pos, bounds, wrap) {

			var xo = pos[0],
				yo = pos[1];
			if (xo < 0) { xo = wrap ? bounds.w : 0; }
			if (yo < 0) { yo = wrap ? bounds.h : 0; }
			if (xo > bounds.w) { xo = wrap ? 0 : bounds.w; }
			if (yo > bounds.h) { yo = wrap ? 0 : bounds.h; }

			return [xo, yo];

		},

		formatTime: function (t) {

			t /= 1000;
			var mins = ~~(t / 60),
				secs = ~~(t - (mins * 60));

			mins = mins.toString().length === 1 ? "" + mins : mins;
			secs = secs.toString().length === 1 ? "0" + secs : secs;
			return mins + ":" + secs;

		},

		formatScore: function (score, digits) {

			return ((score + Math.pow(10, digits)) + "").slice(1);

		},

		loadScripts: function (scripts, cb) {

			var loaded = 0;

			scripts.forEach(function (path) {

				var script = document.createElement('script'),
					qs = window.env.desktop ? "?" + new Date().getTime() : "";

				script.src = "scripts/" + path + ".js" + qs;
				script.onload = function () {
					// FIXME: where did this come from?: resources.toLoadLoaded++;
					if (loaded++ === scripts.length - 1) {
						cb && cb();
					}
				};

				document.body.appendChild(script);

			});

		},

		getByKeyValue: function (arrayOfObj, key, value) {

			return this.getAllByKeyValue(arrayOfObj, key, value)[0];

		},

		getAllByKeyValue: function (arrayOfObj, key, value) {

			return arrayOfObj.filter(function (o) {
				if (o[key] && o[key] === value) {
					return true;
				}
			});

		},

		ajax: function (url, callback) {

			var xhr = new XMLHttpRequest();
			xhr.addEventListener("readystatechange", function() {
				if (this.readyState < 4) {
					return;
				}

				if (xhr.readyState == 4) {
					callback(xhr);
				}

			}, false);
			xhr.open("GET", url, true);
			xhr.send("");

		},

		fullscreen: {

			toggle: function (dom) {

				if (!document.fullscreenElement &&
					!document.mozFullScreenElement &&
					!document.webkitFullscreenElement) {
					this.request(dom);
				} else {
					this.cancel();
				}
			},

			request: function (dom) {

				if (typeof dom === "string") {
					dom = document.querySelector(dom);
				}

				if (dom.requestFullscreen) {
					dom.requestFullscreen();
				} else if (dom.mozRequestFullScreen) {
					dom.mozRequestFullScreen();
				} else if (dom.webkitRequestFullscreen) {
					dom.webkitRequestFullscreen();
				}

			},

			cancel: function () {

				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}

			}

		},

	};

}(window.Ω));
