import React, { Component } from "react";

class Tweet extends Component {
    constructor() {
      super();
    }
    render() {
      return (
      <div className="row tweet">
          <div className="col-xs-2">
              <img src={this.props.profileImage}/>
          </div>
          <div className="col-xs-10">
              {this.props.tweet}
          </div>
      </div> );
    }
}

Tweet.defaultProps = {
  "profileImage": "http://findicons.com/files/icons/1072/face_avatars/300/i04.png",
  "tweet": "140 empty charaters",
  "link": "#",
  "favorite_count": 0,
  "retweet_count": 0
};

export default Tweet;
