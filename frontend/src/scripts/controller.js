/**
 * Sift Mqtt. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
  }

  // TODO: Link to the docs
  loadView(state) {
    console.log('sift-mqtt: loadView', state);

    // Register for storage update events on the "count" bucket so we can update the UI
    this.storage.subscribe(['count'], this.onStorageCountUpdate.bind(this));
    this.storage.subscribe(['last'], this.onStorageLastUpdate.bind(this));

    switch (state.type) {
      case 'summary':
        return { html: 'summary.html', data: Promise.all([ this.getLast(), this.getWebhook(), this.getCount() ])};
      default:
        console.error('sift-mqtt: unknown Sift type: ', state.type);
    }
  }

  // Event: storage update
  onStorageCountUpdate(value) {
    console.log('sift-mqtt: onStorageCountUpdate: ', value);
    return this.getCount().then(count => {
      // Publish 'count' event to view
      this.publish('count', count);
    });
  }

  onStorageLastUpdate(value) {
    console.log('sift-mqtt: onStorageLastUpdate: ', value);
    return this.getLast().then(last => {
      // Publish 'last' event to view
      this.publish('last', last);
    });
  }

  getLast() {
    return this.storage.get({
      bucket: 'last',
      keys: [ 'VALUE' ]
    }).then(d => d[0].value || 0);
  }

  getCount() {
    return this.storage.get({
      bucket: 'count',
      keys: [ 'under', 'over' ]
    }).then(d => d.map(v => parseInt(v.value) || 0));
  }


  getWebhook() {
    return this.storage.get({
      bucket: '_redsift',
      keys: [ 'webhooks/mqtt' ]
    }).then(d => d[0].value);    
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());