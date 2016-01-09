/**
 * Created by jf on 16/1/9.
 */
var Seneca = require('seneca');

var seneca = new Seneca();
var Gossip = new require('../index');

Gossip(seneca).start({port: 6666, type: 'tcp', host: '127.0.0.1', seeds: ['127.0.0.1:4445']});


setInterval(function () {
    seneca.act({role: "api", cmd: "add", left: 2, right: 3}, function (e, r) {
        console.log("2 + 3 =", r.result);
    });

    seneca.act({role: "api", cmd: "mcl", left: 2, right: 3}, function (e, r) {
        console.log("2 * 3 =", r.result);
    });
}, 2000);