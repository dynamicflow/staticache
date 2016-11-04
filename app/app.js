const config = require('../conf/config.json')[process.env.NODE_ENV || 'dev'];
const fileController = require("./controllers/FileController");
const db = require("./database");

db.sequelize.sync().then(function () {
    console.log("database initialized");
});


const Hapi   = require('hapi');
const joi    = require('joi');


var server = new Hapi.Server({
    debug : {
        request : [ 'error' ]
    },
    connections: {
        routes: {
            cors: true
        }
    }
});

server.connection(config.server);

server.route({
    method: 'POST',
    path: '/static',
    config: {

        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },

        handler: fileController.createFile
    }
});

server.route({
    method: 'GET',
    path: '/static/{object_id}',
    config: {
        validate: {
            params: {
                object_id: joi.string().length(40)
            }
        },
        handler: fileController.fetchFile
    }
});

server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
});
