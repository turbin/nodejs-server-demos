var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

console.log('numCPUs '+ numCPUs);
/** 
cluster 工作的原理是每一个 Node 进程要么是主进程， 要么成为工作进程。 当
一个主进程调用 cluster.fork() 方法时， 它会创建与主进程一模一样的子进程，
除了两个让每个进程可以检查自己是父 / 子进程的属性以外。 在主进程中（ Node
运 行 时 直 接 调 用 的 那 个 脚 本 ）， cluster.isMaster 会 返 回 true， 而 cluster.
isWorker 会 返 回 false。 而 在 子 进 程， cluster.isMaster 返 回 false， 且
cluster.isWorker 返回 true。
 it mean 
*/
if(cluster.isMaster) {
    // create a work thread
    for(var i=0; i<numCPUs; i++){
        cluster.fork();
    }

    console.log('running as master ...');

    cluster.on('death', function(){
        console.log('worker' + cluster.worker.pid+ ' died');
        cluster.fork(); // fork 这个简单的改造让主进程会不停地把死掉的进程重启， 从而保证所有的 CPU 都有我们的服务器在运行
    });

} else {
    // create http server
    //console.log('I am worker ' + cluster.worker.id + ' listen on 8000');
    console.log(`I am worker #${cluster.worker.id}` + ' listen on 8000');
    
    http.Server(function(req, res){
        //FIXME: this callback function will be executed twice?
        /* due to chrome will send the requests in twice. 
           one for url index page,another for favicon.ico that file is the icon file showed in browser. */
        var request = `req.url=${req.url}, req.rawHeaders=${req.rawHeaders}`;
        console.log(`I am worker #${cluster.worker.id} recievied ${request}`);
        res.writeHead(200);
        res.end("hello world \n");
    }).listen(8000);

}





