import socket from "socket.io";

export default ( server ) => {
  return new Promise( ( resolve, reject )=> {
    let io = socket( server );
    io.on( "connection", ( socket ) => {
      resolve( io, socket );
      } );
    } );
};
