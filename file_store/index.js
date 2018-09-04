#!/usr/bin/env node

var koa = require('koa');
var cors = require('koa-cors');
var path = require('path');
var tracer = require('tracer');
var mount = require('koa-mount');
var morgan = require('koa-morgan');
var koaStatic = require('koa-static');

global.C = {
  data: {
    root: '/file_store'
  },
  logger: require('tracer').console({ level: 'info' }),
  morganFormat: ':date[iso] :remote-addr :method :url :status :res[content-length] :response-time ms'
};

// Start Server
var Tools = require('./tools');

var app = koa();
app.use(cors());
app.proxy = true;
app.use(Tools.handelError);
app.use(Tools.realIp);
app.use(morgan.middleware(C.morganFormat));

var IndexRouter = require('./routes');
app.use(mount('/', IndexRouter));
app.use(koaStatic(path.join(__dirname, './public/')));

exports.default = app.callback();

