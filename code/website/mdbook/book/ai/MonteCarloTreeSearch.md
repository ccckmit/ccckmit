# 蒙地卡羅樹狀搜尋

* [蒙地卡羅樹搜尋](https://zh.wikipedia.org/wiki/%E8%92%99%E7%89%B9%E5%8D%A1%E6%B4%9B%E6%A0%91%E6%90%9C%E7%B4%A2)
* [Introduction to Monte Carlo Tree Search](https://jeffbradberry.com/posts/2015/09/intro-to-monte-carlo-tree-search/)
 * [Bandit based Monte-Carlo Planning](https://www.lri.fr/~sebag/Examens_2008/UCT_ecml06.pdf)
* [陳俊嶧碩士論文:一個蒙地卡羅之電腦圍棋程式之設計](https://ir.nctu.edu.tw/bitstream/11536/45925/1/558001.pdf)

專案

* <https://github.com/dsesclei/mcts/tree/master/js/ai>

![[]](MCTS_algorithm.jpg)

* <https://github.com/dbravender/mcts> (讚!)
 * <https://github.com/dbravender/mcts/blob/master/mcts/index.js>
 * <https://github.com/dbravender/mcts/blob/master/test/games.js>

```
D:\code\mcts\test>npm install -g mocha
...
build:supports-color      ▀ ╢█████████████████████████
install:jade → lifecycle  ▐ ╢████████████████████████
postinstall:growl → lifec ▌ ╢████████████████████████
postinstall               ▄ ╢████████████████████████
runTopLevelLifecycles     ▄ ╢████████████████████████
C:\Users\user\AppData\Roaming\npm
└─┬ mocha@2.4.5
  ├── commander@2.3.0
  ├─┬ debug@2.2.0
  │ └── ms@0.7.1
  ├── diff@1.4.0
  ├── escape-string-regexp@1.0.2
  ├─┬ glob@3.2.3
  │ ├── graceful-fs@2.0.3
  │ ├── inherits@2.0.1
  │ └─┬ minimatch@0.2.14
  │   ├── lru-cache@2.7.3
  │   └── sigmund@1.0.1
  ├── growl@1.8.1
  ├─┬ jade@0.26.3
  │ ├── commander@0.6.1
  │ └── mkdirp@0.3.0
  ├─┬ mkdirp@0.5.1
  │ └── minimist@0.0.8
  └── supports-color@1.2.0

runTopLevelLifecycles     ▄ ╢████████████████████████

D:\code\mcts\test>cd ..

D:\code\mcts>mocha


  mcts
    √ should return one option when only one is returned for a state (93ms)
    √ should always select the winning option when there are two options (47ms)

    √ should favor the winning move in a game of Tic Tac Toe
    √ should block the winning move in a game of Tic Tac Toe (1141ms)


  4 passing (1s)

```