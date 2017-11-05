var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));

/**
 * 
如果在文件开头调用 app.listen() ,那么从调用 app.listen()
结束到解析完下面的函数这段时间里,所有到来的请求都将得不到处理。这样的想
法并不正确,原因有二。第一,JavaScript 所有的事件触发都是在事件循环中,这
意味着除非我们已经完成了这次循环中的所有处理函数,否则新的事件是不会被
触发调用的。对这个例子而言,除非我们已经把文件中所有的初始化代码执行完,
否则不会调用 request 事件(从而也就不会调用相应的处理函数)。第二, app.
listen() 函数调用是异步的,因为绑定 TCP 端口也需要花时间,而其他(通过
app.get() 和 app.post() 指定的)事件监听器则是同步的。
 */
app.listen(3000);
console.log('Server Listen 3000');

var tweets = []

// app.get('/', function(req, res){
//  //这个路由处理的代码和我们之前使用的其他路由代码类似， 只不过这次不是调用
// // res.send()， 而是调用 res.render() 函数来渲染一个模版。   
//     var title = 'welcome to node tweet!',
//         header = 'Welcome to Node Tweet !';
    
//     res.render('index', {
//         locals:{
//             'title':title,
//             'header':header,
//             'tweets':tweets,
//             stylesheets:['/public/style.css']
//         }
//     })
// });

/*
Error: Most middleware (like bodyParser) 
is no longer bundled with Express and must be installed separately. 
Please see https://github.com/senchalabs/connect#middleware.
*/

/**
 *app.post() 而 不 是 app.get() 方法,这就意味着它接受的是 HTTP POST 请求而不是 HTTP GET 请求
 */
app.post('/send',function(req, res){
    console.log('in path /send');
    console.log('req.body' + JSON.stringify(req.body));

    if(req && req.body.tweet){
        tweets.push(req.body.tweet)
        console.log('tweets: '+ JSON.stringify(tweets));
        sendToClient(res,{status:'ok', message:'Tweet Recieved'});
    }else{
        sendToClient(res,{status:'failue', message:'No tweet recieved'});
    }
});

app.get('/tweets', function(req, res){
    sendToClient(res,tweets);
});

function sendToClient(res, message){
    console.log('send message: '+JSON.stringify(message));
    res.send(message);
}

