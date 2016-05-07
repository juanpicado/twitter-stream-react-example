"use strict";
import dotenv from "dotenv";
import socketServer from "./server/lib/socket";
import http from "http";
import socialCoordinator from "./server/lib/social/socialCoordinator";
import express from "express";
import { EventEmitter } from "events";
dotenv.config();
var fs = require( "fs" );
var path = require( "path" );
var app = express();
var compress = require( "compression" );
var layouts = require( "express-ejs-layouts" );

app.set( "layout" );
app.set( "view engine", "ejs" );
app.set( "view options", { layout: "layout" } );
app.set( "views", path.join( __dirname, "/server/views" ) );

app.use( compress() );
app.use( layouts );
app.use( "/client", express.static( path.join( __dirname, "/client" ) ) );

app.disable( "x-powered-by" );

var env = {
  production: process.env.NODE_ENV === "production"
};

if ( env.production ) {
  Object.assign( env, {
    assets: JSON.parse( fs.readFileSync( path.join( __dirname, "assets.json" ) ) )
  } );
}

app.get( "/*", function( req, res ) {
  res.render( "index", {
    env: env
  } );
} );

var createTwitterStream = ( server ) => {
  console.log( "createTwitterStream.." );
  return new Promise( ( resolve, reject ) => {
    socketServer( server ).then( ( io, _socket )=> {
      console.log( "websocket server running.." );
      resolve( io, _socket );
  }, reject );
  } );

};

class TweetsHandler extends EventEmitter{
    constructor() {
      super();
    }
    start() {
      socketServer( server ).then( ( io, _socket )=> {
          console.log( "websocket server running.." );
          this.on( "new_tweet", function( tweet ) {
            io.emit( "new_tweet", tweet );
          } );
          _socket.on( "disconnect", function() {

          } );
      } );
    }
}

var port = Number( process.env.PORT || 8007 );
var server = http.createServer( app ).listen( port, () => {
  var log = `Example app listening on port ${port}`;
  console.log( log );
  var tweetsHandler = new TweetsHandler();
  tweetsHandler.start();
  socialCoordinator().twitter().enableStream( ( tweets ) => {
        tweetsHandler.emit( "new_tweet", tweets );
  } );
} );

if ( env.production === false ) {
  var webpack = require( "webpack" );
  var WebpackDevServer = require( "webpack-dev-server" );

  var webpackDevConfig = require( "./webpack.config.development" );

  new WebpackDevServer( webpack( webpackDevConfig ), {
    publicPath: "/client/",
    contentBase: "./client/",
    inline: true,
    hot: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Headers": "X-Requested-With"
    }
  } ).listen( 3000, function( err ) {
    if ( err ) {
      console.log( err );
    }

    console.log( "webpack dev server listening on localhost:3000" );
  } );
}
