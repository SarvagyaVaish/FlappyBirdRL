(function (Ω) {

	"use strict";

	var TrackingCamera = Ω.Camera.extend({

		x: 0,
		y: 0,
		w: 0,
		h: 0,
		xRange: 40,
		yRange: 30,

		init: function (entity, x, y, w, h, bounds) {

			this.w = w;
			this.h = h;
			this.zoom = 1;

			this.bounds = bounds;

			this.track(entity);

		},

		track: function (entity) {

			this.entity = entity;
			this.x = entity.x - (this.w / this.zoom / 2) + (entity.w / this.zoom / 2);
			this.y = entity.y - (this.h / this.zoom / 2);

			this.constrainToBounds();

		},

		constrainToBounds: function () {

			if (this.x < 0) {
				this.x = 0;
			}
			if (this.x > 0) {
				if (this.bounds && this.x + this.w / this.zoom > this.bounds[0]) {
					this.x = this.bounds[0] - this.w / this.zoom;
				}
			}
			if (this.y < 0) {
				this.y = 0;
			}
			if (this.y > 0) {
				if (this.bounds && this.y + this.h / this.zoom > this.bounds[1]) {
					this.y = this.bounds[1] - this.h / this.zoom;
				}
			}

		},

		tick: function () {

			var center = Ω.utils.center(this, this.zoom),
				e = this.entity,
				xr = this.xRange,
				yr = this.yRange;

			if(e.x < center.x - xr) {
				this.x = e.x - (this.w / this.zoom / 2) + xr;
			}
			if(e.x + e.w > center.x + xr) {
				this.x = e.x + e.w - (this.w / this.zoom / 2) - xr;
			}
			if(e.y < center.y - yr) {
				this.y = e.y - (this.h / this.zoom / 2) + yr;
			}
			if(e.y + e.h > center.y + yr) {
				this.y = e.y + e.h - (this.h / this.zoom / 2) - yr;
			}

			this.constrainToBounds();

		},

		render: function (gfx, renderables) {

			if (!this.debug) {
				this._super(gfx, renderables);
				return;
			}

			this._super(gfx, renderables.concat([{
				render: function (gfx, cam) {

					var center = Ω.utils.center(cam, cam.zoom);

					gfx.ctx.strokeStyle = "rgba(200, 255, 255, 1)";
					gfx.ctx.strokeRect(
						center.x - cam.xRange,
						center.y - cam.yRange,
						cam.xRange * 2,
						cam.yRange * 2);

				}
			}]));

		}

	});

	Ω.TrackingCamera = TrackingCamera;

}(window.Ω));
