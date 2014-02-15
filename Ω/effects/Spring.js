(function (Ω) {

	"use strict";

	var Spring = Ω.Class.extend({

		vel: [0, 0],

		init: function (length, strength, friction, gravity) {

			this.springLength = length;
			this.spring = strength;
			this.friction = friction;
			this.gravity = gravity;

		},

		tick: function (fixed, springer) {

			var dx = springer.x - fixed.x,
				dy = springer.y - fixed.y,
				angle = Math.atan2(dy, dx),
				tx = fixed.x + Math.cos(angle) * this.springLength,
				ty = fixed.y + Math.sin(angle) * this.springLength;

			this.vel[0] += (tx - springer.x) * this.spring;
			this.vel[1] += (ty - springer.y) * this.spring;

			this.vel[0] *= this.friction;
			this.vel[1] *= this.friction;

			this.vel[1] += this.gravity;

			return this.vel;

		},

		reset: function () {

			this.vel = [0, 0];


		}

	});

	window.Spring = Spring;

}(window.Ω));
