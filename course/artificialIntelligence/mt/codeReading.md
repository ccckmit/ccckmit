# 機器翻譯程式碼閱讀

目前看來 recurrent.js 最容易，先從 recurrent.js 改起！


  var forwardLSTM = function(G, model, hidden_sizes, x, prev) {
      ...
    // one decoder to outputs at end
    var output = G.add(G.mul(model['Whd'], hidden[hidden.length - 1]),model['bd']);

    // return cell memory, hidden representation and output
    return {'h':hidden, 'c':cell, 'o' : output};
  }

  傳回的 hidden[hidden.length-1] 就是隱層的狀態，可以拿來用！
  output 是輸出，但 cell 是甚麼？


