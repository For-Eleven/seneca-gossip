/**
 * Created by jf on 16/1/9.
 */

var Seneca = require('seneca');
var Gossip = new require('../index');

var seneca = new Seneca();
seneca.add({role: 'api', cmd: 'add'}, function (msg, respond) {
    var result = msg.left + msg.right;
    respond(null, {result: result});
});

var options = {port: 4444, type: 'tcp', host: '127.0.0.1', pin: 'role:api'};

Gossip(seneca).start(options);


var seneca2 = new Seneca();
seneca2.add({role: 'api', cmd: 'mcl'}, function (msg, respond) {
    var result = msg.left * msg.right;
    respond(null, {result: result});
});

var options2 = {port: 4454, type: 'tcp', host: '127.0.0.1', pin: 'role:api',
    seeds: ['127.0.0.1:4445']};

Gossip(seneca2).start(options2);


