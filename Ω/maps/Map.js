(function (Ω) {

	"use strict";

	var Map = Ω.Class.extend({

		x: 0, // Position required for camera rendering check
		y: 0,

		walkable: 0,

		repeat: false,
		parallax: 0,

		init: function (sheet, cells, walkable) {

			this.sheet = sheet;
			this.walkable = walkable || 0;

			this.populate(cells || [[]]);

		},

		populate: function (cells) {

			this.cells = cells;
			this.cellH = this.cells.length;
			this.cellW = this.cells[0].length;
			this.h = this.cellH * this.sheet.h;
			this.w = this.cellW * this.sheet.w;

		},

		render: function (gfx, camera) {

			if (!camera) {
				camera = {
					x: 0,
					y: 0,
					w: gfx.w,
					h: gfx.h,
					zoom: 1
				};
			}

			var tw = this.sheet.w,
				th = this.sheet.h,
				cellW = this.sheet.cellW,
				cellH = this.sheet.cellH,
				stx = (camera.x - (camera.x * this.parallax)) / tw | 0,
				sty = (camera.y - (camera.y * this.parallax)) / th | 0,
				endx = stx + (camera.w / camera.zoom / tw | 0) + 1,
				endy = sty + (camera.h / camera.zoom / th | 0) + 1,
				j,
				i,
				cell;

			if (this.parallax) {
				gfx.ctx.save();
				gfx.ctx.translate(camera.x * this.parallax | 0, camera.y * this.parallax | 0);
			}

			for (j = sty; j <= endy; j++) {
				if (j < 0 || (!this.repeat && j > this.cellH - 1)) {
					continue;
				}
				for (i = stx; i <= endx; i++) {
					if (!this.repeat && i > this.cellW - 1) {
						continue;
					}

					cell = this.cells[j % this.cellH][i % this.cellW];
					if (cell === 0) {
						continue;
					}
					this.sheet.render(
						gfx,
						(cell - 1) % cellW  | 0,
						(cell - 1) / cellW | 0,
						i * tw,
						j * th);
				}
			}

			if (this.parallax) {
				gfx.ctx.restore();
			}

		},

		getBlock: function (block) {

			var row = block[1] / this.sheet.h | 0,
				col = block[0] / this.sheet.w | 0;

			if (row < 0 || row > this.cellH - 1) {
				return;
			}

			return this.cells[row][col];

		},

		getBlocks: function (blocks) {

			return blocks.map(this.getBlock, this);

		},

		getBlockEdge: function(pos, vertical) {

			var snapTo = vertical ? this.sheet.h : this.sheet.w;

		    return Ω.utils.snap(pos, snapTo);

		},

		setBlock: function (pos, block) {

			var row = pos[1] / this.sheet.h | 0,
				col = pos[0] / this.sheet.w | 0;

			if (row < 0 || row > this.cellH - 1 || col < 0 || col > this.cellW - 1) {
				return;
			}

			this.cells[row][col] = block;

		},

		/*
			Maps an image (via a color map) to tiles.

			The color map is a key of the r,g,b,a to tile index. For example:

				{
					"0,0,0,250": 0,
					"250,0,0,250": 1
				}

			Please note, due to me not being bothered figuring out retina displays and Safari's
			non-support of imageSmoothingEnabled, I have simple Math.floor-ed all color components!
			So each component ranges from 0 to 250 in increments of 10.

			This function also returns colors X & Y that weren't mapped to tiles
			(so you can use for entities etc)
		*/
		imgToCells: function (img, colourMap, cb, flipFlags) {

			var self = this,
				entities = {},
				autoColMap = {},
				autoColIdx = 0;

			function canvToCells(canvas) {
				var ctx = canvas.getContext("2d"),
					pix = ctx.webkitGetImageDataHD ?
						ctx.webkitGetImageDataHD(0, 0, canvas.width, canvas.height).data :
						ctx.getImageData(0, 0, canvas.width, canvas.height).data,
					pixOff,
					cells = [],
					i,
					j,
					col,
					key,
					round = function (val) {

						return Math.floor(val / 10) * 10;

					};

				for (j = 0; j < canvas.height; j++) {
					cells.push([]);
					for (i = 0; i < canvas.width; i++) {
						pixOff = j * canvas.width * 4 + (i * 4);
						if (pix[pixOff + 3] !== 0) {

							key = round(pix[pixOff]) + "," +
								round(pix[pixOff + 1]) + "," +
								round(pix[pixOff + 2]) + "," +
								round(pix[pixOff + 3]);

							if (colourMap) {

								// Get the tile from the colour map
								col = colourMap[key];
								if (!col) {
									// This colour is not a tile. It must be an entity...
									if (entities[key]) {
										entities[key].push([i, j]);
									} else {
										entities[key] = [[i, j]];
									}
									col = 0;
								}
								cells[cells.length - 1].push(col);

							} else {

								// No supplied color map.
								// Just set tile indexes to colours, as we see them
								col = autoColMap[key];
								if (!col) {
									autoColMap[key] = ++autoColIdx;
								}
								cells[cells.length - 1].push(col);

							}
						} else {
							cells[cells.length - 1].push(0);
						}
					}
				}

				self.populate(cells);

				return entities;

			}

			var unmapped;
			if (typeof img === "string") {
				// Load first
				Ω.gfx.loadImage(img, function (canvas){

					document.body.appendChild(canvas);

					unmapped = canvToCells(canvas);
					cb && cb(self, unmapped);
				}, flipFlags || 0);
			} else {
				unmapped = canvToCells(img);
			}

			return unmapped;

		}

	});

	Ω.Map = Map;

}(window.Ω));
