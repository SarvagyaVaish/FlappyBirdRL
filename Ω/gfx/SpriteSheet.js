(function (Ω) {

	"use strict";

	var SpriteSheet = Ω.Class.extend({

		init: function (path, width, height, opts) {

			var defaults = {
					flipFlags: null,
					margin: [0, 0],
					padding: [0, 0]
				},
				self = this;

			this.w = width;
			this.h = height || width;
			this.cellW = 0;
			this.cellH = 0;

			// Can pass flipFlags directly: TODO - figure out Options API
			if (!isNaN(opts)) {
				opts = {
					flipFlags: opts
				};
			}
			opts = opts || {};

			this.flipFlags = opts.flipFlags || defaults.flipFlags;
			this.margin = opts.margin || defaults.margin;
			this.padding = opts.padding || defaults.padding;

			if (typeof path !== "string") {
				// Direct init from image
				this.populate(path, this.flipFlags);
			} else {
				Ω.gfx.loadImage(path, function (img) {

					self.populate(img, self.flipFlags);

				});
			}

		},

		populate: function (img, flipFlags) {

			this.sheet = img;
			if (flipFlags >= 0) {
				this.sheet = this.flipImage(img.canvas || img, flipFlags);
			}

			this.cellW = Math.ceil((img.width - this.margin[0]) / (this.w + this.padding[0]));
			this.cellH = Math.ceil((img.height - this.margin[1]) / (this.h + this.padding[1]));

		},

		flipImage: function (img, flags) {

			// flip: x = 1, y = 2, both = 3, none = 0

			var ctx = Ω.gfx.createCanvas(
					img.width * (flags & 1 ? 2 : 1),
					img.height * (flags & 2 ? 2 : 1)
				),
				cellW = img.width / this.w | 0,
				cellH = img.height / this.h | 0,
				i,
				j;

			// Draw the original
			ctx.drawImage(img, 0, 0);

			if (flags & 1) {
				// Flipped X
				for (j = 0; j < cellH; j++) {
					for (i = 0; i < cellW; i++) {
						ctx.save();
						ctx.translate(i * this.w * 0.5, j * this.h);
						ctx.scale(-1 , 1);
						this.render({ctx:ctx}, i, j, -(i * this.w * 0.5) - img.width - this.w, 0);
						ctx.restore();
					}
				}
			}

			if (flags & 2) {
				// Flipped Y
				for (j = 0; j < cellH; j++) {
					for (i = 0; i < cellW; i++) {
						ctx.save();
						ctx.translate(i * this.w, j * this.h * 0.5);
						ctx.scale(1 , -1);
						this.render({ctx:ctx}, i, j, 0, -(j * this.h * 0.5) - img.height - this.h);
						ctx.restore();
					}
				}
			}

			if (flags & 3) {
				// Flipped both
				for (j = 0; j < cellH; j++) {
					for (i = 0; i < cellW; i++) {
						ctx.save();
						ctx.translate(i * this.w * 0.5, j * this.h * 0.5);
						ctx.scale(-1 , -1);
						this.render(
							{ctx:ctx},
							i,
							j,
							-(i * this.w * 0.5) - img.width - this.w,
							-(j * this.h * 0.5) - img.height - this.h);
						ctx.restore();
					}
				}
			}

			return ctx.canvas;

		},

		render: function (gfx, col, row, x, y, w, h, scale) {
			if(col === -1) {
				return;
			}
			scale = scale || 1;
			h = h || 1;
			w = w || 1;

			gfx.ctx.drawImage(
				this.sheet,
				col * (this.w + this.padding[0]) + this.margin[0],
				row * (this.h + this.padding[1]) + this.margin[1],
				w * this.w,
				h * this.h,
				x,
				y,
				w * this.w * scale,
				h * this.h * scale);
		}

	});

	Ω.SpriteSheet = SpriteSheet;

}(window.Ω));
