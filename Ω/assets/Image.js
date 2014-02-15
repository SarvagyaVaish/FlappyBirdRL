(function (Ω) {

	"use strict";

	var Image = Ω.Class.extend({

		init: function (path, flipFlags, scale) {

			var self = this;

			this.path = path;

			Ω.gfx.loadImage(path, function (img){

				self.img = img;

			}, flipFlags);

			this.scale = scale || 1;

		},

		render: function (gfx, x, y) {

			gfx.ctx.drawImage(
				this.img,
				x,
				y,
				this.img.width * this.scale,
				this.img.height * this.scale
			);

		}

	});

	Ω.Image = Image;

}(window.Ω));
