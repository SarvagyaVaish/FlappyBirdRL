(function (Ω) {

	"use strict";

	var rays = {

		cast: function (angle, originX, originY, map) {

			angle %= Math.PI * 2;
			if (angle < 0) angle += Math.PI * 2;

			var twoPi = Math.PI * 2,
				ox = originX / map.sheet.w,
				oy = originY / map.sheet.h,
				right = angle > twoPi * 0.75 || angle < twoPi * 0.25,
				up = angle > Math.PI,
				sin = Math.sin(angle),
				cos = Math.cos(angle),
				dist = null,
				distVertical = 0,
				distX,
				distY,
				xHit = 0,
				yHit = 0,
				cell = 0,
				wallX,
				wallY,

				slope = sin / cos,
				dx = right ? 1 :  -1,
				dy = dx * slope,

				x = right ? Math.ceil(ox) : Math.floor(ox),
				y = oy + (x - ox) * slope;

			while (x >= 0 && x < map.cellW && y >=0 && y < map.cellH) {

				wallX = Math.floor(x + (right ? 0 : -1));
				wallY = Math.floor(y);

				cell = map.cells[wallY][wallX];
				if (cell > 0) {
					distX = x - ox;
					distY = y - oy;
					dist = Math.sqrt(distX * distX + distY * distY);

					xHit = x;
					yHit = y;
					break;
				}
				x += dx;
				y += dy;
			}

			// Check vertical walls
			slope = cos / sin;
			dy = up ? -1 : 1;
			dx = dy * slope;
			y = up ? Math.floor(oy) : Math.ceil(oy);
			x = ox + (y - oy) * slope;

			while (x >= 0 && x < map.cellW && y >=0 && y < map.cellH) {

				wallY = Math.floor(y + (up ? -1 : 0));
				wallX = Math.floor(x);

				cell = wallY < 0 ? null : map.cells[wallY][wallX];
				if (cell) {
					distX = x - ox;
					distY = y - oy;
					distVertical = Math.sqrt(distX * distX + distY * distY);
					if (dist === null || distVertical < dist) {
						dist = distVertical;
						xHit = x;
						yHit = y;
					}
					break;
				}
				x += dx;
				y += dy;
			}

			if (dist) {
				return {
					x: xHit,
					y: yHit
				};
			} else {
				return null;
			}

		},

		draw: function (gfx, ox, oy, rayX, rayY, map) {

			var c = gfx.ctx;

			c.strokeStyle = "rgba(100,0,0,0.2)";
			c.lineWidth = 0.5;

			c.beginPath();
			c.moveTo(ox, oy);
			c.lineTo(rayX * map.sheet.w, rayY * map.sheet.h);
			c.closePath();
			c.stroke();

		}

	};

	Ω.rays = rays;

}(window.Ω));
