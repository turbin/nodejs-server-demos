var request = require('request'),
    assert = require('assert');

    request.post({url:"http://127.0.0.1:3000/send",form:{'tweet':'tweet-test'}}, function(err, res, body){
        if(err){
            return console.error('on err' + err);
        }
        assert.strictEqual(body, '{"status":"ok","message":"Tweet Recieved"}');
        console.log('the server response '+ body);
    });

/*
var http = require('http'),
    assert = require('assert');

var opts = {
    host: 'localhost',
    port: 3000,
    path: '/send',
    method: 'POST',
    headers: {'content-type':'application/x-www-form-urlencoded'}
}

var req = http.request(opts, function(res){
    res.setEncoding('utf-8')

    var data = ''
    res.on('data', function(d){
        data += d
        console.log('recvied '+ data);
    });

    res.on('end', function(){
        assert.strictEqual(data, '{"status":"ok","message":"Tweet Recieved"}');
    });
});
/// when the package recieved from the server, print the req as: req.body{"{\"tweet\":\"tweet-test\"}":""}
// I don't know what the defference implement between request and http.
// so remain the code implemented by request
req.write(JSON.stringify({'tweet':'tweet-test'}));
req.end();
*/

