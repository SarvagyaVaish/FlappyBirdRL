(function (Ω) {

	"use strict";

	var IsoMap = Ω.Map.extend({

		init: function (sheet, data) {

			this._super(sheet, data);

		},

		render: function (gfx, camera) {

			var tw = this.sheet.w,
				th = this.sheet.h / 2,
				stx = camera.x / tw | 0,
				sty = camera.y / th | 0,
				endx = stx + (camera.w / camera.zoom / tw | 0) + 1,
				endy = sty + (camera.h / 0.25 / camera.zoom / th | 0) + 1,
				j,
				i,
				tileX,
				tileY,
				cell;

			for (j = sty; j <= endy; j++) {
				if (j < 0 || j > this.cellH - 1) {
					continue;
				}
				for (i = stx; i <= endx; i++) {
					if (i > this.cellW - 1) {
						continue;
					}
					cell = this.cells[j][i];
					if (cell === 0) {
						continue;
					}

					tileX = (i - j) * th;
					tileX += ((gfx.w / 2) / camera.zoom) - (tw / 2);
					tileY = (i + j) * (th / 2);

					this.sheet.render(
						gfx,
						cell - 1,
						0,
						tileX,
						tileY);
				}
			}

		}

	});

	Ω.IsoMap = IsoMap;

}(window.Ω));
