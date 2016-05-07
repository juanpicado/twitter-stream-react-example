import React, { Component } from "react";
import TweetLiveCounter from "./TweetLiveCounter";
import Tweet from "./Tweet";

class Stream extends Component {

  constructor() {
    super();
      this.state = {
        tweets: [],
        pending_tweets: []
      };
  }

  componentWillMount() {
        var self = this;
        var socket = io();
        socket.connect();

        // Add a connect listener
        socket.on( "connect", function() {
            console.log( "Client has connected to the server!" );
        } );

        // Add a disconnect listener
        socket.on( "disconnect", function() {
            console.log( "The client has disconnected!" );
        } );

        // Recieve every new tweet
        socket.on( "new_tweet", function( data ) {
          if ( self.state.tweets.length > 20 ) {
            self.setState( function( state ) {
              state.pending_tweets.unshift( data );
              return {
                pending_tweets: state.pending_tweets
              };
            } );
          } else {
            self.setState( function( state ) {
              state.tweets.unshift( data );
              return {
               tweets: state.tweets
              };
            } );
          }
        } );
  }

  updateTweets() {
    this.setState( function( state ) {
      state.pending_tweets.map( function( item ) {
          state.tweets.unshift( item );
      } );
      return {
       tweets: state.tweets,
       pending_tweets: []
      };
    } );
  }

  render() {
    if ( this.state.tweets.length === 0 ) {
      return (
        <div></div>
      );
    }
    return (
      <section className="cnnStream">
        <header>CNN Tweet Stream</header>
        <div ref="indexList">
          <div onClick={this.updateTweets.bind( this )}>
          <TweetLiveCounter counter={this.state.pending_tweets.length}/>
          </div>
          {this.state.tweets.map( ( item, index ) => {
            var profile_url = item.user ? item.user.profile_image_url : "http://findicons.com/files/icons/1072/face_avatars/300/i04.png";
            return (
              <Tweet key={index}
                     profileImage={profile_url}
                     tweet={item.text}
                     favorite_count={item.favorite_count}
                     retweet_count={item.retweet_count}>
              </Tweet> );
          } )}
        </div>
      </section>
    );
  }
}

Stream.defaultProps = {
  items: []
};

export default Stream;
