(function (Ω) {

	"use strict";

	var Physics = {

		checkCollision: function (entity, entities, cbName) {

			var i,
				a = entity,
				b,
				ax,
				bx,
				len = entities.length;

			cbName = cbName || "hit";

			for (i = 0; i < len; i++) {

				b = entities[i];

				ax = a.x + (a.xbb || 0);
				bx = b.x + (b.xbb || 0);

				if (a !== b &&
					ax + a.w >= bx &&
				    ax <= bx + b.w &&
				    a.y + a.h >= b.y &&
				    a.y <= b.y + b.h) {
					a[cbName] && a[cbName](b);
					b[cbName] && b[cbName](a);
				}
			}

		},

		checkCollisions: function (entities, cbName) {

			var i,
				j,
				a,
				b,
				all = entities.reduce(function (ac, e) {
					if (Array.isArray(e)) {
						return ac.concat(e);
					}
					ac.push(e);
					return ac;

				}, []),
				len = all.length;

			cbName = cbName || "hit";

			for (i = 0; i < len - 1; i++) {
				a = all[i];
				for (j = i + 1; j < len; j++) {
					b = all[j];

					if (a !== b &&
						a.x + a.w >= b.x &&
					    a.x <= b.x + b.w &&
					    a.y + a.h >= b.y &&
					    a.y <= b.y + b.h) {
						a[cbName] && a[cbName](b);
						b[cbName] && b[cbName](a);
					}
				}
			}
		}

	};

	Ω.Physics = Physics;

}(window.Ω));
