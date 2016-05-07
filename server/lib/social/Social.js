import { EventEmitter } from "events";

export default class Social extends EventEmitter {
  constructor( keys ) {
    super();

    console.log( "keys", keys );
    this.keys = keys;
    this.client = this.createClient();
  }

  getKeys() {
    return this.keys;
  }

  //Override
  createClient() {}

  updates() {}

}
