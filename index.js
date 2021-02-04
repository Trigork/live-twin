const electron = require('electron');
var express    = require('express');
var bodyParser = require('body-parser');
var config     = require('./config');
var path     = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

var express = require('express');
var server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

var apiRoutes = require('./app/routes/api')(server, express);
server.use('/api', apiRoutes);

server.use(express.static(__dirname + '/public'));

// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
server.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

server.listen(config.port);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 840
    });

    mainWindow.loadURL("http://localhost:" + config.port);

    mainWindow.on('closed', function () {
    mainWindow = null;
    });
}
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});