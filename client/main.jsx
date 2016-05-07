"use strict";

import "styles/main.scss";

import React from "react";
import { render } from "react-dom";

import TwitterStream from "components/TwitterStream/Stream";

render( <TwitterStream />, document.getElementById( "js-main" ) );
