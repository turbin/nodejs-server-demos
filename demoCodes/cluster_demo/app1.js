/*
    @file:
        app1.js
    @comment:
        this demo shows how to report the all of status of worker from workers to master
*/


var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var rssWarn = (50 * 1024 * 1024), 
    heapWarn = (50 * 1024 * 1024)

var workers = {}

if(cluster.isMaster) {
    for(var i=0; i<numCPUs; i++) {
        createWorker();
    }

    setInterval(function(){
        var time = new Date().getTime();
        for(pid in workers){
            if(workers.hasOwnProperty(pid) && 
                workers[pid].lastCb + 5000 < time) {

                    console.log('Long running worker ' + pid + ' killed');
                    workers[pid].worker.kill();
                    delete workers[pid];
                    createWorker();
                }
        }
    }, 1000);
} else {
    // server 
    http.Server(function(req, res) {
        //run forever loop in random 
        if(Math.floor(Math.random() * 200) === 4) {
            console.log('Stopped ' + process.pid + ' From ever finishing...');
            while(true) { continue; }
        }
        res.writeHead(200);
        res.end('hello world from '+ process.pid + '\n');
    }).listen(8000);

    // report to master in each seconds:
    setInterval(function report(){
        process.send({cmd: "reportMem", memory:process.memoryUsage(), process:process.pid});
    }, 1000);
}

function createWorker() {
    var worker = cluster.fork();
    console.log('Created worker: '+worker.pid);
    /// setting the started time:
    workers[worker.pid] = {worker:worker, lastCb: new Date().getTime -1000};
    worker.on('message', function(m) {
        if(c.cmd === 'reportMem') {
            workers[m.process].lastCb = new Date().getTime();
            if(m.memory.rss > rssWarn){
                console.log('Worker '+ m.process + ' using too much memory!');
            }
        }
    });
}

