(function (Ω) {

    "use strict";

    var Tiled = Ω.Class.extend({

        w: null,
        h: null,
        tileW: null,
        tileH: null,

        layers: null,

        init: function (file, onload) {

            var self = this;

            this.layers = [];
            this.onload = onload;

            Ω.utils.ajax(file, function (xhr) {

                self.processLevel(JSON.parse(xhr.responseText));

            });
        },

        layerByName: function (name) {

            var layer = Ω.utils.getByKeyValue(this.layers, "name", name);
            return layer ? [layer] : [];

        },

        objectByName: function (layer, name) {

            // TODO: fix the .get(data) shit

            return this.layerByName(layer).get("data").reduce(function(acc, el) {

                // Just return one or zero matchs
                if (acc.length === 0 && el.name === name) {
                    acc = [el];
                }
                return acc;
            }, []);

        },

        objectsByName: function (layer, name) {

            // TODO: fix the .get(data) shit

            var layer = this.layerByName(layer).get("data");

            if (!name) {
                return layer;
            }

            return !layer ? [] : layer.reduce(function(acc, el) {

                if (el.name === name) {
                    acc.push(el);
                }
                return acc;
            }, []);

        },

        processLevel: function (json) {
            this.raw = json;

            this.w = json.width;
            this.h = json.height;
            this.tileW = json.tilewidth;
            this.tileH = json.tileheight;

            this.properties = json.properties;

            this.layers = json.layers.map(function (l) {

                var data;
                if (l.type === "tilelayer") {
                    // convert to 2d arrays.
                    data = l.data.reduce(function (acc, el) {
                        if (acc.length === 0 || acc[acc.length - 1].length % json.width === 0) {
                            acc.push([]);
                        }
                        acc[acc.length - 1].push(el);
                        return acc;
                    }, []);
                } else {
                    // Parse the objects into something useful
                    data = l.objects.map(function (o) {
                        return o;
                    });
                }

                return {
                    name: l.name,
                    type: l.type,
                    data: data,
                    opacity: l.opacity,
                    visible: l.visible
                };

            });

            if (this.onload) {
                this.onload(this);
            }
        }

    });

    window.Tiled = Tiled;

}(Ω));
