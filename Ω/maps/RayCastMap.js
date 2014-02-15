(function (Ω) {

	"use strict";

	var Strip,
		RayCastMap;

	RayCastMap = Ω.Map.extend({

		strips: null,

		init: function (sheet, data, stripWidth, fov) {

			this._super(sheet, data);

			this.strips = [];
			this.setStripWidth(stripWidth || 2);
			this.setFOV(fov || 60);

		},

		setStripWidth: function (stripWidth) {

			this.stripWidth = stripWidth;
			this.numRays = Math.ceil(Ω.env.w / stripWidth);

			if (this.numRays !== this.strips.length) {
				this.strips.length = 0;
				for (var i = 0; i < this.numRays; i++) {
					this.strips.push(new Strip(this.sheet));
				}
			}

		},

		setFOV: function (fov) {

			var fovRad = Ω.utils.deg2rad(fov);
			this.viewDistance = (Ω.env.w / 2) / Math.tan((fovRad / 2));

		},

		tick: function (entities, player) {

			// Turns the entities into an entity map for use in raycasting visibility tests
			var entityMap = entities.reduce(function (acc, n) {

				n.visible = false;
				acc[n.y / 16 | 0] = acc[n.y / 16 | 0] || {};
				acc[n.y / 16 | 0][n.x / 16 | 0] = {
					ent: n
				};
				return acc;

			}, {});

			this.castRays(entityMap, player);

		},

		castRays: function (entities, p) {

			var i,
				strip,
				rayPos,
				rayDist,
				rayAngle,
				hit,
				hitDist,
				viewDistance = this.viewDistance;

			for (i = 0; i < this.numRays; i++) {

				strip = this.strips[i];
				strip.depth = 100;

				// where on the screen does ray go through?
				rayPos = (-this.numRays / 2 + i) * this.stripWidth;
				rayDist = Math.sqrt(rayPos * rayPos + viewDistance * viewDistance);
				rayAngle = Math.asin(rayPos / rayDist);
				hit = Ω.rays.cast(p.rotation + rayAngle, p.x + p.w / 2, p.y + p.h / 2, this, entities);

				if (hit) {

					hitDist = Math.sqrt(hit.dist);
					hitDist = hitDist * Math.cos(rayAngle); // Fix fish-eye

					var height = viewDistance / hitDist | 0,
						width = (viewDistance / hitDist | 0) * this.stripWidth,
						top = (Ω.env.h - height) / 2,
						texX = null,
						texY = null;

					texX = ((hit.cell - 1) * 16) +  Math.floor(hit.textureX * 16);
					texY = hit.shaded ? 32 : 0;

					// Set the ray strip
					// TODO: should be "this.stripWidth", or "width"?
					strip.set(
						i * this.stripWidth,
						top,
						this.stripWidth,
						height,
						hit.dist,
						texX,
						texY
					);
				}

			}

		},

		render: function (gfx, entities, player) {

			var c = gfx.ctx;

			this.strips.concat(entities.filter(function(e) {

				// Filter out not-close baddies
				if (e.radius && e.dist > 30) {
					e.visible = false;
				}
				return e.visible;

			})).sort(function (a, b) {

				return a.dist > b.dist ? -1 : 1;

			}).forEach(function (g) {

				g.render(gfx);

			});

		}

	});

	// Strip represents one vertical strip of the ray caster
	Strip = Ω.Class.extend({

		depth: 0,

		x: 0,
		y: 0,
		h: 0,
		w: 0,

		init: function (map) {

			this.map = map;

		},

		set: function (x, y, w, h, depth, texX, texY) {

			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.dist = depth;

			this.texX = texX;
			this.texY = texY;

		},

		render: function (gfx) {

			var c = gfx.ctx;

			if (this.texX === null) {

				c.fillStyle = "#777";
				c.fillRect(this.x, this.y, this.w, this.h);
				return;

			}

			gfx.ctx.drawImage(
				this.map.sheet,
				this.texX,
				this.texY,
				1,
				32,
				this.x,
				this.y,
				this.w,
				this.h);

		}
	});

	Ω.RayCastMap = RayCastMap;

}(window.Ω));
