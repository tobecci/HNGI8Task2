const http = require('http');
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const { url } = require('inspector');

const server = http.createServer((req, res) => {
});

server.on("connect",(req) => {
    console.log("a connection has been made to the server");
})

function isStaticFile(url){
    if(url.includes('.')){
        return true;
    }
    return false;
}

function handleFileRequest(fileUrl,res){
    let fileFullPath = __dirname+fileUrl;
    console.log("hanling file request", {ext:path.extname(fileUrl)});
    let mimetype = getMimetype(path.extname(fileUrl)); 

    console.log({mime:mimetype});
    fs.readFile(fileFullPath,(err, data)=> {
        if(err){
            if(err.code === 'ENOENT'){
                res.writeHead(404);
                res.end(" ");
            }
            else{
                res.writeHead(500);
                res.end(" ");
            }
            return;
        }
        res.writeHead(300,{'Content-Type':mimetype});
        res.statusCode = 300;
        res.end(data);    
    })
}

function getMimetype(ext){
    let list = {
        ".css":"text/css",
        ".txt":"text/plain",
        ".html":"text/html",
        ".js":"text/javascript",
        ".svg":"image/svg+xml",
        ".webp":"image/webp",
        ".png":"image/png",
        ".jpg":"image/jpeg",
        ".gif":"image/gif",
        ".jpeg":"image/jpeg",
        ".ttf":"font/ttf"
    }
    return list[ext];
}

function renderPage(url, res){
    let fullFilePath = __dirname+url;
    res.writeHead(200,{
        "Content-Type":"text/html",
    });

    let page = fs.readFileSync(fullFilePath, {encoding:"utf-8"});
    res.end(page);
}

function handleUrlRequests(url,res){    
    console.log("handling url request");
    if(url === "/"){
        renderPage("/index.html",res);
    }
    else{
        res.statusCode = 404;
        res.end("Page Not Found");
    }
}

server.on('request',(req, res) => {
    let url = req.url;
    if(isStaticFile(url)){
        handleFileRequest(url,res);
    }
    else{
        handleUrlRequests(url,res);
    }

    let fileUrl = __dirname+url;
    console.log(fileUrl);
});

server.listen(port,() => {
    console.log(`server started on http://localhost:${port}`);
});

