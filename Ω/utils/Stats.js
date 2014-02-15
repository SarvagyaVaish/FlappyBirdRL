(function (Ω) {

	"use strict";

	var Stats = function () {

		var startTime = Date.now(),
			previous = startTime,
			fpsCur = 0,
			fpsMin = 100,
			fpsMax = 0,
			ticks = 0;

		return {

			pos: [Ω.env.w - 53, 3],

			start: function () {

				startTime = Date.now();

			},

			fps: function () {

				return [fpsCur, fpsMin, fpsMax];

			},

			stop: function () {

				var now = Date.now();

				ticks++;

				if (now > previous + 1000) {
					fpsCur = Math.round((ticks * 1000) / (now - previous));
					fpsMin = Math.min(fpsMin, fpsCur);
					fpsMax = Math.max(fpsMax, fpsCur);

					previous = now;
					ticks = 0;
				}

			}
		};

	};

	Ω.utils = Ω.utils || {};
	Ω.utils.Stats = Stats;

}(window.Ω));
