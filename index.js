'use strict'

var _ = require('lodash');

var Gossiper = require('./lib/gossiper').Gossiper;

function Gossip() {
}

Gossip.prototype.start = function (options) {
    var seneca = this.seneca;
    this.seneca_options = options;
    seneca.listen(options);
    seneca.client(options);
    options.goss_port = options.port + 1;
    var self = this;
    options = seneca.util.clean(_.extend({
        host: '127.0.0.1',
        seeds: []
    }, options));
    seneca.gossips = {};
    var goss = seneca.goss = new Gossiper(options.goss_port, options.seeds, options.host);
    goss.on('update', function (peer, k, v) {
        if (k == 'seneca') {
            seneca.gossips[peer] = v;
            self.addClient(peer, v.options);
        }
    });

    goss.on('new_peer', function (peer_name) {
        seneca.log.info("new peer :" + peer_name);
    });

    goss.on('peer_failed', function (peer_name) {
        seneca.log.warn("seed [", peer_name, '] is unreachable!');
        delete seneca.gossips[peer_name];
    });

    goss.start(function () {
        seneca.log.info("gossip ", options);
    });

    var _seneca = {options: self.seneca_options, pattern: seneca.list};
    goss.setLocalState("seneca", _seneca);


};

Gossip.prototype.addClient = function (peer, op) {
    this.seneca.log.info('add client', op);
    this.seneca.client(op);
};

module.exports = function (seneca) {
    var gossip = new Gossip();
    gossip.seneca = seneca;

    return gossip;
};


