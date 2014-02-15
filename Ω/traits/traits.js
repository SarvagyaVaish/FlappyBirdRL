(function (Ω) {

	"use strict";

	/*

		Add velocity, acceleration, and friction
		to an Entity

	*/
	var Velocity = Ω.Trait.extend({

		makeArgs: function (props) {

			return [props.friction];

		},

		init_trait: function (t, friction) {

			t.velX = 0;
			t.velY = 0;
			t.accX = 0;
			t.accY = 0;

			t.friction = friction || 0.75;

			// Overwrite the Entity base moveBy
			this.moveBy = function (x, y) {

				t.accX += x;
				t.accY += y;

			};

		},

		tick: function (t) {

			t.velX += t.accX;
			t.velY += t.accY;
			t.velX *= t.friction;
			t.velY *= t.friction;

			t.accX = 0;
			t.accY = 0;

			this.xo += t.velX;
			this.yo += t.velY;

			return true;

		}

	});


	var Gravity = Ω.Trait.extend({

		makeArgs: function (props) {

			return [];

		},

		init_trait: function (t) {

			t.velY = 0;
			t.accY = 0;

		},

		tick: function (t) {

			if (this.falling) {
				t.accY += 0.25;
				t.accY = Ω.utils.clamp(t.accY, 0, 20);
			} else {
				t.accY = 0;
			}

			this.yo += t.accY;

			return true;

		}

	});

	/*
		Set the entity's `remove` flag after X ticks
	*/
	var RemoveAfter = Ω.Trait.extend({

		makeArgs: function (props) {

			return [props.ticks];

		},

		init_trait: function (t, ticks) {

			t.ticks = ticks || 100;

		},

		tick: function (t) {

			if (!this.remove && t.ticks-- === 0) {
				this.remove = true;
				console.log("Trait 'remove' executed.");
			}

			return !(this.remove);

		}

	});

	/*
		Peform a callback after X ticks
	*/
	var Ticker = Ω.Trait.extend({

		makeArgs: function (props) {

			return [props.ticks, props.cb];

		},

		init_trait: function (t, ticks, cb) {

			t.ticks = ticks || 100;
			t.cb = cb || function () {};

		},

		tick: function (t) {

			if (t.ticks-- <= 0) {
				t.cb.call(this, t);
				console.log("Ticker trait expired");
				return false;
			}


			return true;

		}

	});


	/*

		Bounce a value over a sine curve
		Defaults to `yo` (to affect the entity's Y movement)
		but could be applied to any property that needs
		a sin-y changes

	*/
	var Sin = Ω.Trait.extend({

		makeArgs: function (props) {

			return [props.speed, props.amp, props.target];

		},

		init_trait: function (t, speed, amp, target) {

			t.speed = speed || 100;
			t.amp = amp || 5;
			t.target = target || "yo";

			return t;

		},

		tick: function (t) {

			this[t.target] += Math.sin(Ω.utils.now() / t.speed) * (t.amp / 10);

			return true;

		}

	});

	Ω.traits = {
		RemoveAfter: RemoveAfter,
		Ticker: Ticker,
		Sin: Sin,
		Velocity: Velocity,
		Gravity: Gravity
	};

}(window.Ω));
