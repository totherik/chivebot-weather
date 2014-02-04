'use strict';

var pkg = require('./package'),
    weather = require('./weather');


module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.dependency('chivebot', function (plugin, next) {

            plugin.plugins.chivebot.registerCommand('weather', function (raw, args, cb) {
                weather.fetch(args[2], cb);
            });

            next();

        });

        next();

    }

};