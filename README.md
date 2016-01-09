# seneca-gossip

**seneca-gossip** a cluster solution using gossip protocols for seneca. 

### Feature

**Cluster** : A set of nodes joined together through the membership service.
**Auto-discovery** : Auto make client when a new node joined.

### Usage

#### Server

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
    

#### Client

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
    
    **************************
    2 + 3 = 5
    2 * 3 = 6



### TODO

* add test cases
* handle some exception. like outtime...
* add cluster sharding support
* ...

### Acknowledgements

Both the gossip protocol and the failure detection algorithms are based off of academic papers and Cassandra's (http://www.cassandra.org/) implementation of those papers.  This library is highly indebted to both.

* ["Efficient reconciliation and flow control for anti-entropy protocols"](http://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf)
* ["The Phi accrual failure detector"](http://vsedach.googlepages.com/HDY04.pdf)
