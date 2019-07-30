import { LightningElement } from 'lwc';
import { reducer } from 'c/exampleAppService';

export default class ExampleApp extends LightningElement {
  reducer = reducer;

}