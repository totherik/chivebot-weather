'use strict';

var util = require('util'),
    pkg = require('./package'),
    weather = require('./weather');


module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.dependency('chivebot', function (plugin, next) {

            plugin.plugins.chivebot.registerCommand('weather', function (raw, args, cb) {
                weather.fetch(args[2], function (err, data) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb(null, util.format('Hey, <@%s|%s>! %s', raw['user_id'], raw['user_name'], data))
                });
            });

            next();

        });

        next();

    }

};