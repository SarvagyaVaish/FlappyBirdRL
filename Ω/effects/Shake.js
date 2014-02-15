(function (Ω) {

	"use strict";

	var Shake = Ω.Class.extend({

		init: function (time) {

			this.time = time || 10;

		},

		tick: function () {

			return this.time--;

		},

		render: function (gfx) {

			gfx.ctx.translate(Math.random() * 8 | 0, Math.random() * 4 | 0);

		}

	});

	Ω.Shake = Shake;

}(window.Ω));
