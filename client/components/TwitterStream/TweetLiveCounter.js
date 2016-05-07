import React, { Component } from "react";

class TweetLiveCounter extends Component {
    constructor() {
      super();
    }
    render() {
      if ( this.props.counter > 0 ) {
          return (
          <div className="row counter">
              <div className="col-xs-12">
                  {this.props.counter} new results
              </div>
          </div> );
        } else {
            return ( <div/> );
        }
    }
}

export default TweetLiveCounter;
