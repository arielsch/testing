var http =require("http");
var    app  = http.createServer(handler),
    url = require("url"),
    path = require("path"),
    fs = require("fs")  ;
var requestApp = require("request");



//    , io = require('socket.io').listen(app);

app.listen(8080);

function handler(request, response) {

    var parsedUrl = url.parse(request.url, true); // true to get query as object
    //the path
    var uri = parsedUrl.pathname;
    //Get query params as object
    var params = parsedUrl.query;

     filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        console.log(params);
        if(uri=="/getstring"){
            requestApp({
                uri: "http://www.hebcal.com/converter/?cfg=json&gy="+params["gy"]+"&gm="+params["gm"]+"&gd="+params["gd"]+"&g2h=1",
                method: "GET",
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10,
                json:true

            }, function(error, responses, body) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end((body["hd"]).toString()+"/"+body["hm"]+"?"+params["index"]);
                console.log(body);
            });

            return;
        }



        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += 'src/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}
