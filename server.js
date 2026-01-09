const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

var server = http.createServer(function(req, resp){
    if (req.url === "/") {
        fs.readFile('./index.html', function(error, fileContent){
            if(error){
               resp.writeHead(500, {'Content-Type': 'text/plain'});
               resp.end('Error');
            }
           else{
               resp.writeHead(200, {'Content-Type': 'text/html'});
               resp.write(fileContent);
               resp.end();
            }
        });
    } else {
        fs.readFile(`./${req.url}`, function(error, fileContent){
            console.log(req.url)
            if(error){
               resp.writeHead(500, {'Content-Type': 'text/plain'});
               resp.end('Error');
            }
           else{
               resp.writeHead(200);
               resp.write(fileContent);
               resp.end();
            }
        });
    }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});