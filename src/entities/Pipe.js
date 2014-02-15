(function (Ω) {

    "use strict";

    var Pipe = Ω.Entity.extend({

        reset: false,
        counted: false,

        init: function (group, dir, x, y, speed) {
            this._super(x, y);
            this.group = group;
            this.w = 48;
            this.h = 320;
            this.speed = speed;
            this.dir = dir;
        },

        tick: function () {
            this.x -= this.speed;
            if (this.reset) {
                this.reset = false;
            }
            if (this.x < -this.w) {
                this.x += (Ω.env.w * 1.7) + this.w;
                this.reset = true;
                this.counted = false;
            }
            return true;
        },

        render: function (gfx) {
            var c = gfx.ctx;
            c.fillStyle = "blue";
            c.fillRect(this.x, this.y, this.w, this.h);
            window.game.atlas.render(gfx, this.dir === "up" ? "pipe_up" : "pipe_down", this.x - 2, this.y);
        }
    });

    window.Pipe = Pipe;

}(window.Ω));