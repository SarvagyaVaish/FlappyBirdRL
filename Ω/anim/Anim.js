(function (Ω) {

	"use strict";

	var Anim = Ω.Class.extend({

		init: function (name, sheet, speed, frames, cb) {

			this.name = name;
			this.sheet = sheet;
			this.frames = frames;
			this.speed = speed;
			this.cb = cb;

			this.scale = 1;
			this.changed = false;
			this.rewound = false;

			this.reset();

		},

		tick: function () {

			var diff = Ω.utils.now() - this.frameTime;
			this.changed = false;
			this.rewound = false;

			if (diff > this.speed) {
				this.frameTime = Ω.utils.now() + (Math.min(this.speed, diff - this.speed));
				if (++this.curFrame > this.frames.length - 1) {
					this.curFrame = 0;
					this.rewound = true;
					this.cb && this.cb();
				};
				this.changed = true;
			}

		},

		reset: function () {
			this.curFrame = 0;
			this.frameTime = Ω.utils.now();
		},

		render: function (gfx, x, y) {

			this.sheet.render(
				gfx,
				this.frames[this.curFrame][0],
				this.frames[this.curFrame][1],
				x,
				y,
				1,
				1,
				this.scale);

		}

	});

	Ω.Anim = Anim;

}(window.Ω));
