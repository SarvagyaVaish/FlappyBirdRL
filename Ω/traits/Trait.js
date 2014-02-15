(function (Ω) {

	"use strict";

	var Trait = Ω.Class.extend({

		// Convert a property list to an argument array
		// based on the nees of the trait.
		makeArgs: function () {

			return [];

		},

		init: function () {},

		init_trait: function () {},

		tick: function () {

			return true;

		}

	});

	Ω.Trait = Trait;

}(window.Ω));
