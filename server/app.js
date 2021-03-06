const config = require('../conf/config.json')[process.env.NODE_ENV || 'dev'];
const fileController = require("./controllers/FileController");
const checkController = require("./controllers/CheckController");
const fileService = require("./services/FileService");
const db = require("./database");
const log4js = require('log4js');

log4js.configure(config.log4js);
const logger = log4js.getLogger("Main");

logger.info("starting");

db.sequelize.sync().then(function () {
    logger.info("database initialized");
});

fileService.mkdir(config.storage.temp);
fileService.mkdir(config.storage.data);

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
    path: '/cache',
    config: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            maxBytes: 100 * 1048576
        },
        handler: fileController.createFile,
        state: {
            parse: false, // parse and store in request.state
            failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    }
});

server.route({
    method: 'GET',
    path: '/cache/{id}',
    config: {
        validate: {
            params: {
                id: joi.string().length(40)
            }
        },
        handler: fileController.fetchFile,
        cache: {
            expiresIn: 365 * 24 * 60 * 60 * 1000,
            privacy: 'public'

        },
        state: {
            parse: false, // parse and store in request.state
            failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    }
});

server.route({
    method: 'GET',
    path: '/static/{path*}',
    config: {
        validate: {
            params: {
                path: joi.any()

            }
        },
        handler: fileController.searchAndRedirect,
        state: {
            parse: false, // parse and store in request.state
            failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    }
});

server.route({
    method: 'GET',
    path: '/check',
    config: {
        handler: checkController.check,
        state: {
            parse: false, // parse and store in request.state
            failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    }
});

server.start(function () {
    logger.info('info', 'Server running at: ' + server.info.uri);
});