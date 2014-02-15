(function (Ω) {

    "use strict";

    var Bird = Ω.Entity.extend({
        w: 25,
        h: 15,

        ac: 0,
        jumpAc: -7,
        maxGravity: 8,
        gravityAc: 0.4,

        color: 0,

        state: null,
        flapping: 100,

        font: new Ω.Font("res/flapfont.png", 16, 22, "abcdefghijklmnopqrstuvwxyz"),
        font2: new Ω.Font("res/flapfont2.png", 16, 22, "abcdefghijklmnopqrstuvwxyz"),

        sounds: {
            "hit": new Ω.Sound("res/audio/sfx_hit", 1)
        },

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;
            this.state = new Ω.utils.State("BORN");
        },

        tick: function () {
            this.state.tick();

            switch (this.state.get()) {
                case "BORN":
                    this.state.set("CRUISING");
                    break;
                case "CRUSING":
                    this.y += Math.sin(Date.now() / 150) * 0.70;
                    this.flapping = 150;
                    break;
                case "RUNNING":
                    if (this.state.first()) {
                        this.ac = this.jumpAc;
                        this.flapping = 75;
                    }
                    var oldy = this.y;
                    this.ac = Math.min(this.ac + this.gravityAc, this.maxGravity);
                    this.y = Math.max(5, this.y + this.ac);

                    this.handleKeys();

                    if (this.y > Ω.env.h - 112 - this.h) {
                        this.y = oldy;
                        this.die();
                    }
                    break;
                case "DYING":
                    this.ac = Math.min(this.ac + 0.4, 10);
                    if (this.y < Ω.env.h - 112 - this.h) {
                        this.y += this.ac;
                    }
                    this.flapping = 0;
                    break;
            }
        },


        performJump: function () {
            this.ac = this.jumpAc;
        },


        handleKeys: function () {
            if (Ω.input.lastKey) {
                if (String.fromCharCode(Ω.input.lastKey).toLowerCase() === 'p') {
                    a = a;
                }
                else {
                    this.ac = this.jumpAc;
                }
                /*
                if (String.fromCharCode(Ω.input.lastKey).toLowerCase() === this.curWord[this.curIdx]){
                    this.ac = jumpAc;
                    this.curIdx++;
                    if (this.curIdx > this.curWord.length - 1) {
                        this.curIdx = 0;
                        this.curWord = this.nextWord;
                        this.nextWord = this.chooseWord();
                    }
                }
                */
                Ω.input.lastKey = null;
            }

        },

        setColor: function (color) {
            this.color = color;
        },

        die: function () {
            if (this.screen.state.is("RUNNING")) {
                //this.sounds.hit.play();
                this.screen.state.set("DYING");
                this.state.set("DYING");
                this.ac = 0;
            }
        },

        hit: function (p) {
            this.die();
        },

        render: function (gfx) {

            var c = gfx.ctx;

            window.game.atlas.render(
                gfx,
                "bird" + this.color + "_" + Ω.utils.toggle(this.flapping, 3),
                this.x - 11,
                this.y - 17);

        }
    });

    window.Bird = Bird;

}(window.Ω));