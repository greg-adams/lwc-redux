import { LightningElement, track } from 'lwc';
import { reducer } from 'c/exampleAppService';

export default class ExampleApp extends LightningElement {
    reducer = reducer;

    @track showActive = true;

    disconnect() {
        this.showActive = false;
    }

    reconnect() {
        this.showActive = true;
    }
}
