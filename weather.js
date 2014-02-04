'use strict';

var http = require('http'),
    util = require('util'),
    sax = require('sax');


var ADJECTIVES = [
    { temp: 32, desc: 'freezing' },
    { temp: 45, desc: 'cold' },
    { temp: 60, desc: 'chilly' },
    { temp: 70, desc: 'cool' },
    { temp: 80, desc: 'nice' },
    { temp: 90, desc: 'warm' },
    { temp: 110, desc: 'hot' },
    { temp: 999, desc: 'Tyson-punch-to-the-face' }
];

function getAdjective(temp) {
    var adjective = 'boring';
    ADJECTIVES.some(function (item) {
        adjective = item.desc;
        return temp <= item.temp;
    });
    return adjective;
}


function parse(stream, cb) {
    var current, data, parser;

    function text(text) {
        switch (current.name) {
            case 'success':
            case 'city':
            case 'state':
            case 'temperature':
                data[current.name] = text;
                break;
            default:
                break;
        }
    }

    function opentag(node) {
        current = node;
    }

    function end() {
        var message;

        if (data.success !== 'true') {
            message = 'Something went wrong while I was fetching the weather.';
        } else if (typeof data.temperature === 'undefined' || isNaN(parseInt(data.temperature, 10))) {
            message = util.format('I\'m not quite sure what the current temperature is for %s, %s.', data.city, data.state);
        } else {
            message = util.format('The weather in %s, %s is a %s %d degrees.', data.city, data.state, getAdjective(data.temperature), data.temperature);
        }

        cb(null, message);
    }

    data = { success: 'false' };
    parser = sax.createStream(false, { lowercase: true, trim: true, normalize: true });
    parser.on('text', text);
    parser.on('opentag', opentag);
    parser.on('error', cb);
    parser.on('end', end);
    stream.pipe(parser);
}


exports.fetch = function (zip, cb) {
    var options, req;

    if (isNaN(parseInt(zip, 10))) {
        cb(null, 'Gimme a *workable* zip code! Five digit number, yo.');
        return;
    }

    options = {
        host: 'wsf.cdyne.com',
        port: 80,
        path: '/WeatherWS/Weather.asmx/GetCityWeatherByZIP?zip=' + zip
    };

    req = http.get(options, function (res) {
        res.setEncoding('utf8');
        parse(res, cb);
    });

    req.on('error', cb);
};