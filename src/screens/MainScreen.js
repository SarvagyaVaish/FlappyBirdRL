(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		speed:  2,
		bird: null,
		pipes: null,

		score: 0,
		state: null,

		bg: 0,
		bgOffset: 0,

		sounds: {
			"point": new Ω.Sound("res/audio/sfx_point", 1),
			"hit": new Ω.Sound("res/audio/sfx_hit", 1)
		},

		shake: null,
		flash: null,


		
		m_state: {"vertical_distance": 0, "horizontal_distance": 0},
		m_state_dash: {"vertical_distance": 0, "horizontal_distance": 0},
		explore: 0.00,
		action_to_perform: "do_nothing",
		resolution: 4,
		alpha_QL: 0.7,
		vertical_dist_range: [-350, 190],
		horizontal_dist_range: [0, 180],


		min_diff: 9999, 
		max_diff: -9999, 

		init: function () {
			this.reset();
			console.log("**** **** INIT **** ****");

			// Vertical Distance
			this.Q = new Array();
			for (var vert_dist = 0; vert_dist < (this.vertical_dist_range[1] - this.vertical_dist_range[0])/this.resolution; vert_dist++) {
				this.Q[vert_dist] = new Array();

				// Horizontal Distance
				for (var hori_dist = 0; hori_dist < (this.horizontal_dist_range[1] - this.horizontal_dist_range[0])/this.resolution; hori_dist++) {
					this.Q[vert_dist][hori_dist] = {"click": 0, "do_nothing": 0};
				}
			}

			console.log(this.Q);

			// Old Q Init
			//this.Q = new Array();
			//for (var i = 0; i < 400/this.resolution; i++) {
			//	this.Q[i] = {"click": 0, "do_nothing": 0};
			//}
			//console.log(this.Q);

		},


		reset: function () {
			this.score = 0;
			var offset = Ω.env.w * 1;
			this.state = new Ω.utils.State("BORN");
			this.bird = new window.Bird(Ω.env.w * 0.24, Ω.env.h * 0.46, this);
			this.bg = Ω.utils.rand(2);
			this.bird.setColor(Ω.utils.rand(3));
			this.pipes = [
				new window.Pipe(0, "up", offset + Ω.env.w, Ω.env.h - 170, this.speed),
				new window.Pipe(0, "down", offset + Ω.env.w, - 100, this.speed),

				new window.Pipe(1, "up", offset + (Ω.env.w * 1.6), Ω.env.h - 170, this.speed),
				new window.Pipe(1, "down", offset + (Ω.env.w * 1.6), - 100, this.speed),

				new window.Pipe(2, "up", offset + (Ω.env.w * 2.2), Ω.env.h - 170, this.speed),
				new window.Pipe(2, "down", offset + (Ω.env.w * 2.2), - 100, this.speed)
			];

			this.setHeight(0);
			this.setHeight(1);
			this.setHeight(2);
		},


		tick: function () {
			this.state.tick();
			this.bird.tick();

			var valid = false;
			var reward = 0;
					
			switch (this.state.get()) {
				case "BORN":
					this.state.set("RUNNING");
					this.bird.state.set("CRUSING");
					break;


				case "RUNNING":
					if (this.state.first()) {
						this.bird.state.set("RUNNING");
					}
					this.tick_RUNNING();

					// Step 2: Observe Reward R
					valid = true;
					reward = 1;

					break;


				case "DYING":
					this.state.set("GAMEOVER");

					// Step 2: Observe Reward R
					valid = true;
					reward = -1000;

					break;


				case "GAMEOVER":
					if (this.state.first()) {
						if (this.score > window.game.best) {
							window.game.best = this.score;
						}
					}

					this.sounds.hit.play();
					
					//console.log("Died at location: " + this.bird.y);
					//for (var i = 80; i < 90; i++) {
					//	console.log( "i: " + i + ", click: " + this.Q[i]["click"] + ", do_nothing: " +this.Q[i]["do_nothing"] );
					//}

					// Print debug stuff 
					//this.printState();

					this.reset();
					this.state.set("BORN");
					break;
			}

			//console.log("Reward: " + reward);

			// To find vertical dist limits
			//for (var i = 0; i < 6; i++) {
			//	if (this.pipes[i].dir == "up") {
			//		var diff = (this.bird.y - this.pipes[i].y);
			//		this.min_diff = Math.min(diff, this.min_diff);
			//		this.max_diff = Math.max(diff, this.max_diff);
			//		console.log(this.pipes[i].y);
			//	}
			//}
			//console.log("(" + this.min_diff + ", " + this.max_diff + ")");



			if (valid) {

				// Step 2: Observe State S'
				var horizontal_distance = 9999;
				var vertical_distance = 9999;

				for (var i = 0; i < 6; i++) {
					if (this.pipes[i].dir == "up" && this.pipes[i].x + this.pipes[i].w >= this.bird.x) {
						var diff = (this.pipes[i].x + this.pipes[i].w - this.bird.x);
						if (horizontal_distance > diff) {
							horizontal_distance = diff;
							vertical_distance = (this.bird.y - this.pipes[i].y);
						}
					}
				}

				this.m_state_dash.vertical_distance = vertical_distance;
				this.m_state_dash.horizontal_distance = horizontal_distance;

				
				//console.log("Vertical: \t" + vertical_distance);
				//console.log("Horizontal:\t" + horizontal_distance);
				//console.log("--");

				//for (var i = 0; i < 6; i++) {
				//	console.log("i: " + i + ", dir: " + this.pipes[i].dir + ",  \ty: ", this.pipes[i].y);
				//}
				//console.log("--");


				// Step 3: Update Q(S, A)
				var state_bin_v = 
				Math.max( 
					Math.min ( 
						Math.floor((this.vertical_dist_range[1]-this.vertical_dist_range[0]-1)/this.resolution), 
						Math.floor( (this.m_state.vertical_distance - this.vertical_dist_range[0])/this.resolution )
					), 
					0
				);
				
				var state_bin_h = 
				Math.max( 
					Math.min ( 
						Math.floor((this.horizontal_dist_range[1]-this.horizontal_dist_range[0]-1)/this.resolution), 
						Math.floor( (this.m_state.horizontal_distance - this.horizontal_dist_range[0])/this.resolution )
					), 
					0
				);


				var state_dash_bin_v = 
				Math.max( 
					Math.min ( 
						Math.floor((this.vertical_dist_range[1]-this.vertical_dist_range[0]-1)/this.resolution), 
						Math.floor( (this.m_state_dash.vertical_distance - this.vertical_dist_range[0])/this.resolution )
					), 
					0
				);
				
				var state_dash_bin_h = 
				Math.max( 
					Math.min ( 
						Math.floor((this.horizontal_dist_range[1]-this.horizontal_dist_range[0]-1)/this.resolution), 
						Math.floor( (this.m_state_dash.horizontal_distance - this.horizontal_dist_range[0])/this.resolution )
					), 
					0
				);
				

				//console.log("S: V - " + state_bin_v + ", H - " + state_bin_h);
				//console.log("S' V - " + state_dash_bin_v + ", H - " + state_dash_bin_h);
				//console.log("---");


				var click_v = this.Q[state_dash_bin_v][state_dash_bin_h]["click"];
				var do_nothing_v = this.Q[state_dash_bin_v][state_dash_bin_h]["do_nothing"]
				var V_s_dash_a_dash = Math.max(click_v, do_nothing_v);

				var Q_s_a = this.Q[state_bin_v][state_bin_h][this.action_to_perform];
				this.Q[state_bin_v][state_bin_h][this.action_to_perform] = 
					Q_s_a + this.alpha_QL * (reward + V_s_dash_a_dash - Q_s_a);


				//for (var i = 90; i < 95; i++) {
				//	console.log( "i: " + i + ", click: " + this.Q[i]["click"] + ", do_nothing: " +this.Q[i]["do_nothing"] );
				//}


				// Step 4: S <- S'
				this.m_state = clone(this.m_state_dash);

				//console.log("--");

				// Step 1: Select and perform Action A
				if (Math.random() < this.explore) {
					this.action_to_perform = Ω.utils.rand(2) == 0 ? "click" : "do_nothing";
				}
				else {
					var state_bin_v = 
					Math.max( 
						Math.min ( 
							Math.floor((this.vertical_dist_range[1]-this.vertical_dist_range[0]-1)/this.resolution), 
							Math.floor( (this.m_state.vertical_distance - this.vertical_dist_range[0])/this.resolution )
						), 
						0
					);
					
					var state_bin_h = 
					Math.max( 
						Math.min ( 
							Math.floor((this.horizontal_dist_range[1]-this.horizontal_dist_range[0]-1)/this.resolution), 
							Math.floor( (this.m_state.horizontal_distance - this.horizontal_dist_range[0])/this.resolution )
						), 
						0
					);

					var click_v = this.Q[state_bin_v][state_bin_h]["click"];
					var do_nothing_v = this.Q[state_bin_v][state_bin_h]["do_nothing"]
					this.action_to_perform = click_v > do_nothing_v ? "click" : "do_nothing";
				}

				//console.log("action performed: " + this.action_to_perform);

				if (this.action_to_perform == "click") {
					this.bird.performJump();
				}

			}



			if (this.shake && !this.shake.tick()) {
				this.shake = null;
			}
			if (this.flash && !this.flash.tick()) {
				this.flash = null;
			}

		},


		printState: function () {

			$("#debug").text("");
			var debug_string = "";

			// Vertical Distance
			for (var vert_dist = 0; vert_dist < (this.vertical_dist_range[1] - this.vertical_dist_range[0])/this.resolution; vert_dist++) {
				
				// Horizontal Distance
				for (var hori_dist = 0; hori_dist < (this.horizontal_dist_range[1] - this.horizontal_dist_range[0])/this.resolution; hori_dist++) {
				
					var debug_char = this.Q[vert_dist][hori_dist]["click"] > this.Q[vert_dist][hori_dist]["do_nothing"] ? 'c' : '-';
					//$("#debug").append(debug_char);
					debug_string = debug_string + debug_char;
				}
				debug_string = debug_string + "<br />";
			}
			$("#debug").append(debug_string);
		},


		tick_RUNNING: function () {

			this.moveLand();

			this.pipes = this.pipes.filter(function (p) {
				p.tick();
				if (!p.counted && p.x < this.bird.x) {
					p.counted = true;
					this.score += 0.5;
					this.sounds.point.play();
				}

				if (p.reset) {
					this.setHeight(p.group);
				}
				return true;
			}, this);

			Ω.Physics.checkCollision(this.bird, this.pipes);
		},

		moveLand: function () {
			this.bgOffset -= this.speed;
			if (this.bgOffset < -Ω.env.w) {
				this.bgOffset += Ω.env.w;
			}
		},

		setHeight: function (group) {
			var h = (Math.random() * 160 | 0) + 130;
			this.pipes.filter(function (p) {
				return p.group === group;
			}).forEach(function (p) {
				p.y = p.dir == "up" ? h + 65 : h - p.h - 65;
			});
		},

		render: function (gfx) {
			var atlas = window.game.atlas;

			gfx.ctx.save();

			this.shake && this.shake.render(gfx);

			this.renderBG(gfx, atlas);

			this.renderGame(gfx, atlas);

			switch (this.state.get()) {
				case "GETREADY":
					this.renderGetReady(gfx, atlas);
					this.renderFG(gfx, atlas);
					break;
				case "GAMEOVER":
					this.renderFG(gfx, atlas);
					this.renderGameOver(gfx, atlas);
					break;
				case "RUNNING":
					this.renderRunning(gfx, atlas);
					this.renderFG(gfx, atlas);
					break;
				default:
					this.renderFG(gfx, atlas);
					break;
			}


			gfx.ctx.restore();

			this.flash && this.flash.render(gfx);

		},

		renderBG: function (gfx, atlas) {
			atlas.render(gfx, "bg_" + (this.bg === 1 ? "night" : "day"), 0, 0);
		},

		renderGame: function (gfx) {
			this.pipes.forEach(function (p) {
				p.render(gfx);
			});
			this.bird.render(gfx);
		},

		renderFG: function (gfx, atlas) {
			atlas.render(gfx, "land", this.bgOffset, gfx.h - 112);
			atlas.render(gfx, "land", Ω.env.w + this.bgOffset, gfx.h - 112);
		},

		renderRunning: function (gfx, atlas) {
			if (this.state.count < 30) {
				gfx.ctx.globalAlpha = 1 - (this.state.count / 30);
				this.renderGetReady(gfx, atlas);
				gfx.ctx.globalAlpha = 1;
			}
			this.renderScore(gfx, atlas);
		},

		renderGameOver: function (gfx, atlas) {

			var count = this.state.count,
				yOff;

			if (count > 20) {
				yOff = Math.min(5, count - 20);
				atlas.render(gfx, "text_game_over", 40, gfx.h * 0.24 + yOff);
			}

			if (count > 70) {
				yOff = Math.max(0, 330 - (count - 70) * 20);
				atlas.render(gfx, "score_panel", 24, gfx.h * 0.38 + yOff);
				var sc = this.score + "",
					right = 218;
				for (var i = 0; i < sc.length; i++) {
					atlas.render(gfx, "number_score_0" + sc[sc.length - i - 1], right - i * 16, 231 + yOff);
				}

				sc = window.game.best + "";
				for (i = 0; i < sc.length; i++) {
					atlas.render(gfx, "number_score_0" + sc[sc.length - i - 1], right - i * 16, 272 + yOff);
				}

				var medal = "";
				if (this.score >= 5) medal = "3";
				if (this.score >= 10) medal = "2";
				if (this.score >= 20) medal = "1";
				if (this.score >= 30) medal = "0";
				if (medal) {
					atlas.render(gfx, "medals_" + medal, 55, 240 + yOff);
				}
			}

			if (count > 100) {
				atlas.render(gfx, "button_play", 20, gfx.h - 172);
				atlas.render(gfx, "button_score", 152, gfx.h - 172);
			}
		},

		renderGetReady: function (gfx, atlas) {
			//atlas.render(gfx, "text_ready", 46, gfx.h * 0.285);
			//atlas.render(gfx, "tutorial", 88, gfx.h * 0.425);

			this.renderScore(gfx, atlas);
		},

		renderScore: function (gfx, atlas) {
			var sc = this.score + "";
			for (var i = 0; i < sc.length; i++) {
				atlas.render(gfx, "font_0" + (48 + parseInt(sc[i], 10)), i * 18 + 130, gfx.h * 0.16);
			}
		}
	});

	window.MainScreen = MainScreen;

}(window.Ω));


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}