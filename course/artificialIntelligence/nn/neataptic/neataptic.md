## 原始碼解析

https://github.com/wagenaartje/neataptic/blob/master/src/node.js

72行

    // Squash the values received
    this.activation = this.squash(this.state) * this.mask;
    this.derivative = this.squash(this.state, true);

每個 node 都有 activation 與 derivative 。


https://github.com/wagenaartje/neataptic/blob/master/src/layer.js

196 : 

Layer.LSTM = function (size) {

https://github.com/wagenaartje/neataptic/blob/master/src/architect.js

196 : 
      var memoryCell = new Group(block);    

memoryCell 應該就是 hidden Layer

https://github.com/wagenaartje/neataptic/blob/master/src/group.js

  Group 是一群節點


22:
  for (var i = 0; i < size; i++) {
    this.nodes.push(new Node());
  }
}  


正向傳遞

  activate: function (value) {

     ...
         return values;
  },

反向傳遞


  propagate: function (rate, momentum, target) {
    ...
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (typeof target === 'undefined') {
        this.nodes[i].propagate(rate, momentum);
      } else {
        this.nodes[i].propagate(rate, momentum, target[i]);
      }
    }

    ...
  }      