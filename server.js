var http =require("http");
var    app  = http.createServer(handler),
    url = require("url"),
    path = require("path"),
    fs = require("fs")  ;
var requestApp = require("request");



//    , io = require('socket.io').listen(app);

app.listen(8080);

function handler(request, response) {

    var uri = url.parse(request.url).pathname
        , filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if(uri=="/getstring"){


            requestApp({
                uri: "http://www.hebcal.com/converter/?cfg=json&gy=2013&gm=06&gd=06&g2h=1",
                method: "GET",
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function(error, responses, body) {
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.end(body);
                console.log(body);
            });

//            $.ajax({
//            url: "http://www.hebcal.com/converter/?cfg=json&gy=2013&gm=06&gd=06&g2h=1",
////                url: "http://localhost:8080/getstring",
//                type: "Get",
////                dataType:"text",
//                success: function (data) {
//                    response.writeHead(200, {"Content-Type": "text/plain"});
//                    response.end(data["hebrew"]);
//
//                },
//                error: function (err) {
//
//                    alert(err);
//
//                }
//            });
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
