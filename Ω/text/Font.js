(function (Ω) {

	"use strict";

	var Font = Ω.Class.extend({

		map: " !\"#$%&'()*+,-./0123456789:;<=>?@abcdefghijklmnopqrstuvwxyz[/]^_`abcdefghijklmnopqrstuvwxyz{|}~",

		init: function (path, w, h, map) {

			this.sheet = new Ω.SpriteSheet(path, w, h);

			this.map = (map || this.map).split("").map(function(c) {
				return c.charCodeAt(0);
			});

			this.w = w;
			this.h = h;

		},

		write: function (gfx, msg, x, y) {

			if (!msg) {
				return;
			}

			msg = msg.toString();

			var cellW = this.sheet.cellW;

			for (var i = 0; i < msg.length; i++) {

				var ch = msg.charCodeAt(i),
					index = this.map.indexOf(ch);

				if (ch === 32 || index === -1) {
					continue;
				}

				this.sheet.render(
					gfx,
					index % cellW,
					index / cellW | 0,
					x + (i * this.w),
					y);

			}

		}

	});

	Ω.Font = Font;

}(window.Ω));
