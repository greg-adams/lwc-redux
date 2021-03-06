import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import reduxResourceURL from '@salesforce/resourceUrl/redux';
import reduxThunkResourceURL from '@salesforce/resourceUrl/reduxThunk';
import { initStore } from 'c/store';

export default class Provider extends LightningElement {
  @api reducer = () => ({});
  @api storeKey;

  @track resourceLoaded = false;

  connectedCallback() {
    Promise.all([
      loadScript(this, reduxResourceURL),
      loadScript(this, reduxThunkResourceURL),
    ])
      .then(() => {
        initStore(
          this.reducer,
          {
            storeKey: this.storeKey || undefined
          }
        );
        this.resourceLoaded = true;
      })
  }

}
