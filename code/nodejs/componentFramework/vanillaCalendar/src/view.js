// view.js

import { calendar } from './template';

export default class View {
  constructor() {
    this.el = document.getElementById('target');
  };
  render(data) {
    this.el.innerHTML = calendar(data);
  };
}