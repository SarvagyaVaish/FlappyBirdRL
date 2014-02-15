(function (Ω) {

	"use strict";

	var Camera = Ω.Class.extend({

		x: 0,
		y: 0,
		w: 0,
		h: 0,

		init: function (x, y, w, h) {

			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.zoom = 1;

		},

		tick: function () {},

		render: function (gfx, renderables) {

			var c = gfx.ctx,
				self = this;

			c.save();
			c.scale(this.zoom, this.zoom);
			c.translate(-(Math.round(this.x)), -(Math.round(this.y)));

			renderables
				// Flatten to an array
				.reduce(function (ac, e) {

					if (Array.isArray(e)) {
						return ac.concat(e);
					}
					ac.push(e);
					return ac;

				}, [])
				// Remove out-of-view entites
				.filter(function (r) {

					return r.repeat || !(
						r.x + r.w < self.x ||
						r.y + r.h < self.y ||
						r.x > self.x + (self.w / self.zoom) ||
						r.y > self.y + (self.h / self.zoom));

				})
				// Draw 'em
				.forEach(function (r) {

					r.render(gfx, self);

				});

			c.strokeStyle = "red";
			c.strokeRect(this.x, this.y, this.w / this.zoom, this.h / this.zoom);

			c.restore();

		}

	});

	Ω.Camera = Camera;

}(window.Ω));
