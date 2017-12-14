// main.js

import { $on } from './util';
import View from './view';
import Model from './model';
import Controller from './controller';

class App {
  constructor() {
    const model = new Model();
    const view = new View();
    this.controller = new Controller(model, view);
  };
}

const app = new App();

const setView = () => {
  app.controller.setView(document.location.hash);
}

$on(window, 'load', setView);
$on(window, 'hashchange', setView);