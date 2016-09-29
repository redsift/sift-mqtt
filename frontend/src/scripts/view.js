/**
 * Sift Mqtt. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

import { select } from "d3-selection";
import { html as bars } from "@redsift/d3-rs-bars";

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    this.chart = bars()
                  .orientation('bottom')
                  .fill('global')
                  .width(300)
                  .height(300);

    // Listens for 'last' events from the Controller
    this.controller.subscribe('last', this.onLast.bind(this));
    this.controller.subscribe('count', this.onCount.bind(this, true));
  }

  // TODO: link to docs
  presentView(value) {
    console.log('sift-mqtt: presentView: ', value);

    let url = value.data[1];
    select('#hook').text(url);

    let param = select('#param').node();
    param.value = 0;
    select('#invoke').on('click', () => this.invoke(url, param.value));

    this.onLast(value.data[0]);
    this.onCount(false, value.data[2]);
  };

  // TODO: link to docs
  willPresentView(value) {
    console.log('sift-mqtt: willPresentView: ', value);
  };

  onLast(data) {
    console.log('sift-mqtt: onLast: ', data);
    select('#last').text(data);
  }

  onCount(animate, data) {
    console.log('sift-mqtt: onCount: ', data);
    let e = select('#chart').datum([ { l:'<50' , v:data[0] }, { l:'>=50', v:data[1] } ]);
    if (animate) {
      e = e.transition();
    }
    e.call(this.chart);
  }

  invoke(urlTemplate, param) {
    let url = urlTemplate.replace('{param}', param);
    console.log('invoking', url);

    let http = new XMLHttpRequest();
    http.open("GET", url, true); // true for asynchronous 
    http.send(null);
  }

}

registerSiftView(new MyView(window));
