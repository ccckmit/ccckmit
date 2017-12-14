# ADNN -- 包含自動微分的神經網路套件

https://github.com/dritchie/adnn

Javascript neural networks on top of general scalar/tensor reverse-mode automatic differentiation.

## Example 1 : mlpXor.js

file: [mlpXor.js](mlpXor.js)

run: 

```
D:\Dropbox\ai6\book\nn\adnn>node mlpXor.js
buildNet
loadData
nnTrain
predict
input={"dims":[2],"length":2,"data":{"0":0,"1":0}} probs={"dims":[2],"length":2,
"data":{"0":0.9995266414085302,"1":0.0004733585914697014}}
input={"dims":[2],"length":2,"data":{"0":0,"1":1}} probs={"dims":[2],"length":2,
"data":{"0":0.00277378478556229,"1":0.9972262152144377}}
input={"dims":[2],"length":2,"data":{"0":1,"1":0}} probs={"dims":[2],"length":2,
"data":{"0":0.002685249616197764,"1":0.9973147503838022}}
input={"dims":[2],"length":2,"data":{"0":1,"1":1}} probs={"dims":[2],"length":2,
"data":{"0":0.9950174687367755,"1":0.004982531263224475}}
```

The mlpXor.js really learn the xor gate correctly.

## Example 2 : mlp.js

file: [mlp.js](mlp.js)

run: 

```
D:\Dropbox\ai6\book\nn\adnn>node mlp
buildNet
loadData
nnTrain
predict
input={"dims":[6],"length":6,"data":{"0":0.4,"1":0.5,"2":0.5,"3":0,"4":0,"5":0}}
 probs={"dims":[2],"length":2,"data":{"0":0.5085872311962694,"1":0.4913637377939
1646}}
input={"dims":[6],"length":6,"data":{"0":0.5,"1":0.3,"2":0.5,"3":0,"4":0,"5":0}}
 probs={"dims":[2],"length":2,"data":{"0":0.5085849360011107,"1":0.4913726527872
373}}
input={"dims":[6],"length":6,"data":{"0":0.4,"1":0.5,"2":0.5,"3":0,"4":0,"5":0}}
 probs={"dims":[2],"length":2,"data":{"0":0.5085872311962694,"1":0.4913637377939
1646}}
input={"dims":[6],"length":6,"data":{"0":0,"1":0,"2":0.5,"3":0.3,"4":0.5,"5":0}}
 probs={"dims":[2],"length":2,"data":{"0":0.5085557023295415,"1":0.4914859155065
0095}}
input={"dims":[6],"length":6,"data":{"0":0,"1":0,"2":0.5,"3":0.4,"4":0.5,"5":0}}
 probs={"dims":[2],"length":2,"data":{"0":0.5085535590968002,"1":0.4914942259804
851}}
input={"dims":[6],"length":6,"data":{"0":0,"1":0,"2":0.5,"3":0.5,"4":0.5,"5":0}}
 probs={"dims":[2],"length":2,"data":{"0":0.5085514135448059,"1":0.4915025456689
525}}
```

The mlp.js do not learn output correctly. I don't know why ?



