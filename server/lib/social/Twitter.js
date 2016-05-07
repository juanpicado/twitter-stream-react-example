import _ from "underscore";
import TwitterAPI from "twitter";
import Social from "./Social";

export default class Twitter extends Social {
  constructor( keys ) {
    super( keys );

    // It could be used
    this.username = process.env.TWITTER_OWNER;
    this.userId = process.env.TWITTER_OWNER_ID;
  }

  createClient() {
      var client = new TwitterAPI( this.keys );
      return client;
  }

  timeline( count ) {
    return new Promise( ( resolve, reject )=> {
      this.client.get( "statuses/user_timeline", {
        screen_name: this.username,
        count: count
      }, ( error, tweets, response ) => {
        if ( !error ) {
          resolve( tweets );
        } else {
          console.error( error );
          reject( error );
        }
      } );
    } );
  }

  enableStream( broadcast ) {
      this.client.stream( "statuses/filter", {
          "track": "cnn"
      }, ( stream ) => {
        console.log( "streaming tweets .." );
        stream.on( "data", ( tweet ) => {

          if ( _.isFunction( broadcast ) ) {
            broadcast( tweet );
          } else {
            console.warn( "is not possible to broadcast the tweet" );
          }
        } );

        // Handle errors
        stream.on( "error", ( error ) => {
          console.log( "stream error->", error.message );
        } );
      } );
  }
}
