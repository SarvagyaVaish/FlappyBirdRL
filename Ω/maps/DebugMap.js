(function (Ω) {

	"use strict";

	/* Just draw some colourful squares, eh... */

	var DebugMap = Ω.Map.extend({

		init: function (tileW, tileH, xTiles, yTiles, cells, walkable, seed) {

			var ctx = this.ctx = Ω.gfx.createCanvas(tileW * xTiles, tileH * yTiles),
				data = Ω.gfx.ctx.createImageData(tileW * xTiles,tileH * yTiles),
				pix = data.data,
				numPix = data.width * data.height,
				oldSeed,
				off;

			this.seed = seed || (Math.random() * 10000 | 0);

			oldSeed = Ω.utils.rnd.seed;
			Ω.utils.rnd.seed = this.seed;
			off = Ω.utils.rnd.rand(255);

			for (var i = 0; i < numPix; i++) {
				var row = i / data.width | 0,
					col = ((i / tileW) | 0) % data.width % xTiles,
					noise = Ω.utils.rnd.rand(100) < 30 ? (Ω.utils.rnd.rand(30)) : 0,
					color = ((row / tileH) + 1 + (col * 3) + off + (noise / 10)) | 0;

				// Remove the edges, for some roundiness.
				if (i % tileW === 0 && (i / data.width | 0) % tileH === 0) { color = 0; }
				if ((i + 1) % tileW === 0 && (i / data.width | 0) % tileH === 0) { color = 0; }
				if (i % tileW === 0 && ((i / data.width | 0) + 1) % tileH === 0) { color = 0; }
				if ((i + 1) % tileW === 0 && ((i / data.width | 0) + 1) % tileH === 0) { color = 0; }

				pix[i * 4] = (color * 50) % 255 + noise;
				pix[i * 4 + 1] = (color * 240) % 255 + noise;
				pix[i * 4 + 2] = (color * 80) % 255 + noise;
				pix[i * 4 + 3] = color === 0 ? 0 : 255;
			}

			Ω.utils.rnd.seed = oldSeed;

			ctx.putImageData(data, 0, 0);

			this._super(
				new Ω.SpriteSheet(ctx.canvas, tileW, tileH),
				cells,
				walkable);

		},

		dump: function () {

			console.log("seed:", this.seed);

			var img = new Image();
			img.src = this.ctx.canvas.toDataURL();
			document.body.appendChild(img);

		}

	});

	Ω.DebugMap = DebugMap;

}(window.Ω));
