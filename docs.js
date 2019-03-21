const http		= require('http');
const path		= require('path');
const handler	= require('serve-handler');
const opn		= require("opn");

const examplesPath		= path.join(__dirname, "docs");
const httpPort			= 5000;

const server	= http.createServer((request, response) =>
{
	// You pass two more arguments for config and middleware
	// More details here: https://github.com/zeit/serve-handler#options
	return handler(request, response, {
		"public": examplesPath
	});
});

server.listen(httpPort, () =>
{
	console.log(`Docs visible at http://localhost:${httpPort}`);

	opn(`http://localhost:${httpPort}`);
});

