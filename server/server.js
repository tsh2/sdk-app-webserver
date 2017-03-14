import https from 'https';
import express from 'express';
import bodyparser from 'body-parser';
import websocketinit from './comms/websocket';
import ipcinit from './comms/ipc';

const app = express();

var HTTPS_SERVER_CERT = process.env.HTTPS_SERVER_CERT || '';
var HTTPS_SERVER_PRIVATE_KEY = process.env.HTTPS_SERVER_PRIVATE_KEY || '';

var credentials = {
	key:  HTTPS_SERVER_PRIVATE_KEY,
	cert: HTTPS_SERVER_CERT,
};

app.use('/', express.static("static"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

console.log("STARTING HTTPS SERVER!!");
console.log(credentials);

const server = https.createServer(credentials, app);
let PORT = 8080

if (process.argv.length > 2){
   PORT = parseInt(process.argv[2]);
}
console.log("initing websockets");
websocketinit(['databox'],server);

console.log("initing ipc");
ipcinit();

app.get('/ui', function(req,res){
	console.log("seen a call to ui, sending back index!");
	res.render('index');
});

app.get('/', function(req,res){
  console.log("seen a get /");
  res.render('index');
});

app.use('/comms', require('./routes/comms'));

//redirect any failed routes to root
app.use(function(req,res){
  	console.log("failed route - redirecting to /")
   	res.redirect("/");
});

server.listen(PORT);
