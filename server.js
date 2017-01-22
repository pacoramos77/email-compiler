var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
	res.sendfile('editor.html');
});


io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('newusr',function()
	{
		socket.broadcast.emit('nwusr');
	});

	socket.on('welcome',function(data)
	{
		console.log('welcome all'); console.dir(data);

		io.emit('all',{
						'txt':'',
						'x':data,
						'compiled': compileInky(data),
						'cursor': { row: 0, column: 0 },
						'kc':0
						});
	});

	socket.on('write',function(data)
	{
		console.log('write'); console.dir(data);

		data.compiled = compileInky(data.x);

		io.emit('print',data);
		socket.broadcast.emit('printcode',data);
	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



function compileInky (input) {
	//return 'AAAA '+(new String(input)).toUpperCase();
	var Inky = require('inky').Inky;
	var cheerio = require('cheerio');

	var options = {};

	// The same plugin settings are passed in the constructor
	var i = new Inky(options);
	var html = cheerio.load(input)


	// Now unleash the fury
	var convertedHtml = i.releaseTheKraken(html);
	console.log('convertedHtml');
	console.dir(convertedHtml);
	
	return convertedHtml;
	// The return value is a Cheerio object. Get the string value with .html()
	// return convertedHtml.html();
	
}