(function (Ω) {

	"use strict";

	var Anims = Ω.Class.extend({

		current: null,
		all: null,

		init: function (anims) {

			if (anims.length) {
				this.all = anims;
				this.current = anims[0];
			}

		},

		tick: function () {

			this.current.tick();

		},

		add: function (anim) {

			if (!this.all) {
				this.all = [];
				this.current = anim;
			}
			this.all.push(anim);

		},

		each: function (func) {

			this.all.forEach(func);

		},

		get: function () {

			return this.current.name;

		},

		set: function (animName) {

			var anim = this.all.filter(function (anim) {
				return anim.name === animName;
			});

			if (anim.length) {
				this.current = anim[0];
				this.current.reset();
			}

		},

		setTo: function (animName) {

			if (this.get() !== animName) {
				this.set(animName);
			}

		},

		changed: function () {

			return this.current.changed;

		},

		rewound: function () {

			return this.current.rewound;

		},

		render: function (gfx, x, y) {

			this.current.render(gfx, x, y);

		}

	});


	Ω.Anims = Anims;

}(window.Ω));