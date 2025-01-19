const express = require('./config/express');
//const https = require('https');
//const fs = require('fs');
const port = 3000;

/*const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
};*/

const app = express();

/*https.createServer(options, app).listen(port, () => {
    console.log('Server is running on HTTPS at port', port);
});*/

app.listen(port, () => {
    console.log('Server is running on HTTP at port', port);
});
