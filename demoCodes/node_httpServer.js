var express = require('express');
console.log('express =' + express);

var app = express();

app.get('/', function(req, res){
    res.send('Welcome to Node Twitter!');
});

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);
});





