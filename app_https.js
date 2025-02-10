const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();

// 读取 SSL 证书和私钥
const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

app.use('/.well-known', express.static(path.join(__dirname, 'public')));

// 创建 HTTPS 服务器
https.createServer(options, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
});