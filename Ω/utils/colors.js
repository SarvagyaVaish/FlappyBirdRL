(function (Ω) {

	"use strict";

	var curIdx = -1,
		palette = [],
		palettes = {
			"c64": ["#000000","#FFFFFF","#68372B","#70A4B2","#6F3D86","#588D43","#352879","#B8C76F","#6F4F25","#433900","#9A6759","#444444","#6C6C6C","#9AD284","#6C5EB5","#959595"]
		},
		colors;

	colors = {

		set: function (type) {

			if (Array.isArray(type)) {
				palette = type.slice(0);
				return;
			}

			if (palettes[type]) {
				palette = palettes[type].slice(0);
				return;
			}

			palette.length = 0;
			for (var i = 0; i < 36; i++) {
				palette.push("hsl(" + (i * 10 | 0) + ", 50%, 50%)");
			}

		},

		get: function (idx) {
			return palette[Ω.utils.clamp(idx % palette.length, 0, palette.length - 1)];
		},

		rnd: function () {
			return palette[Math.random() * palette.length | 0];
		},

		rndHSL: function (s, l) {

			s = s === undefined ? 50 : s;
			l = l === undefined ? 50 : l;

			return "hsl(" + (Math.random() * 360 | 0) + ", " + s + "%, " + l + "%)";

		},

		next: function () {

			curIdx = (curIdx + 1) % palette.length;
			return palette[curIdx];

		}

	};

	colors.set();

	Ω.utils = Ω.utils || {};
	Ω.utils.colors = colors;

}(window.Ω));
