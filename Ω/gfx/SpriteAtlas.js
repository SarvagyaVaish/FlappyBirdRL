(function (Ω) {

    "use strict";

    var SpriteAtlas = Ω.Class.extend({

        images: null,
        path:  "",
        plist: null,
        csv: null,

        init: function (type, data) {
            this.images = {};

            switch (type) {
                case "plist":
                    this.initPList(data);
                    break;
                case "csv":
                    this.initCSV(data);
                    break;
            }
        },

        initPList: function (plist) {
            var self = this;

            this.path = plist.split("/").slice(0, -1).join("/") + "/";

            var resolve = Ω.preload(plist);
            Ω.utils.ajax(plist, function (xhr) {
                var parser = new DOMParser(),
                    xmlText = xhr.responseText,
                    xmlDoc,
                    root;

                xmlDoc = parser.parseFromString(xmlText, "application/xml");
                root = xmlDoc.getElementsByTagName("dict")[0];

                self.plist = self.parsePList(root);
                self.loadImages(self.plist.images);
                resolve();
            });
        },

        initCSV: function (path) {
            var self = this;

            var resolve = Ω.preload(path);
            Ω.utils.ajax(path + ".txt", function (xhr) {
                Ω.gfx.loadImage(path + ".png", function (img) {
                    self.images.main = img;
                    self.parseCSV(xhr.responseText, img);
                });
                resolve();
            });
        },

        loadImages: function (imageData) {
            var self = this;
            imageData.forEach(function (imgData) {
                Ω.gfx.loadImage(self.path + imgData.path, function (img) {
                    self.images[imgData.path] = img;
                });
            });
        },

        parseCSV: function (csv, img) {
            var out = this.csv = {};
            csv.split("\n").forEach(function (line) {
                var parts = line.split(" "),
                    w = img.width,
                    h = img.height;
                out[parts[0]] = {
                    name: parts[0],
                    w: Math.round(parseInt(parts[1], 10)),
                    h: Math.round(parseInt(parts[2], 10)),
                    x: Math.round(parts[3] * w),
                    y: Math.round(parts[4] * h)
                };
            });
        },

        parsePList: function (nodes) {
            var kids = nodes.children,
                key,
                value;

            var out = {},
                arrOut;

            for (var i = 0; i < kids.length; i += 2) {
                key = kids[i];
                value = kids[i + 1];
                switch (value.nodeName) {
                    case "dict":
                        value = this.parsePList(value);
                        break;
                    case "string":
                        value = value.textContent;
                        break;
                    case "integer":
                        value = value.textContent;
                        break;
                    case "array":
                        arrOut = [];
                        for(var j = 0; j < value.children.length; j++) {
                            arrOut.push(this.parsePList(value.children[j]));
                        }
                        value = arrOut;
                        break;
                    case "true":
                        value = true;
                        break;
                    case "false":
                        value = false;
                        break;
                    default:
                        console.error("unhandled plist type:", value.nodeName);
                        break;

                }
                out[key.textContent] = value;
            }
            return out;

        },

        render: function (gfx, name, x, y) {

            if (this.plist) {
                this.renderPList(gfx, x, y);
                return;
            }

            var img = this.images.main,
                imgData = this.csv[name];

            if (!imgData) {
                return;
            }

            gfx.ctx.drawImage(
                img,
                imgData.x,
                imgData.y,
                imgData.w,
                imgData.h,
                x,
                y,
                imgData.w,
                imgData.h);

        },

        renderPList: function (gfx, x, y) {
            var img = this.images["sprites.1.png"];

            var si = ((Date.now() / 300 | 0) % 10) + 1;

            var subimg = this.plist.images[1].subimages[si].textureRect;
            var t = subimg.replace("{{", "").replace("}}","").replace("},{", ",").split(",");

            var x1 = t[0];
            var x2 = t[1];
            var w = t[2];
            var h = t[3];
            gfx.ctx.drawImage(
                img,
                x1,
                x2,
                w,
                h,
                x,
                y,
                w,
                h);
        }

    });

    Ω.SpriteAtlas = SpriteAtlas;

}(window.Ω));
