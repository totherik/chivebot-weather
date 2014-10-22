'use strict';

var Util = require('util');
var Package = require('./package');
var Weather = require('./weather');


exports.register = function (plugin, options, next) {

    plugin.dependency('chivebot', function (plugin, next) {

        plugin.plugins.chivebot.registerCommand('weather', function (raw, args, cb) {
            Weather.fetch(args._[2], function (err, data) {
                if (err) {
                    cb(err);
                    return;
                }
                cb(null, Util.format('Hey, <@%s|%s>! %s', raw['user_id'], raw['user_name'], data))
            });
        });

        next();
    });

    next();
};


exports.register.attributes = {
    pkg: Package
};