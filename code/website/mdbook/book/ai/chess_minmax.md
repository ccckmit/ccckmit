## 電腦下棋的關鍵： Min-Max 對局搜尋與 Alpha-Beta 修剪算法

### 前言

雖然我們在前文設計五子棋程式時單純使用了盤面評估函數就已經設計出了「具備自動下棋能力的電腦程式」，但是這種設計方法是不夠強大的。

電腦下棋要夠強大，通常必須採用「Min-Max 對局搜尋法」，如果能夠搜尋得愈深，電腦的棋力通常就會越高。

但是、對於電腦而言，每一層都有很多可能的下法，對手也可能會有很多的回應方式，這樣一層一層下去會有組合爆炸的問題。

舉例而言，假如對上文中有 256 格的棋盤而言，第一子的下法有 256 種，第二子的下法就有 255 種，....

因此若我們要進行 n 層的徹底搜尋，那在下第一步之前就必須探詢 256*255*...*(256-n+1) 這麼多種可能性，當 n 超過 10 層時，幾乎任何電腦都不可能在短短數秒內完成這樣的搜尋。

於是我們就必須減少蒐尋的可能性，這時我們可以採用著名的「 Alpha-Beta Cut」修剪法來減少蒐尋的空間大小。

讓我們先來瞭解一下何謂 「Min-Max 對局搜尋法」。

### Min-Max 對局搜尋法

在下棋的時候，如果要打敗對手，必須考量讓自己得分最多，且讓對手得分最少，Min-Max 正是根據這樣的想法而設計出來的。

必須注意的是，當電腦要下一子之前，當然會下讓自己得分最多的那一格，但是這很容易會落入對手的陷阱，因為得分最多的那一格很可能接下來失分更多。

於是、一個合理的想法是將所有層次分為「敵我雙方」兩類，我方下的那層得分越多越好，而對方下的那層失分越少越好。

而且、我們不能假設對方是個笨蛋，因此在每一層上，我們都必須認為「對方可能會下出讓我們失分最多的一步」，而我們必須盡可能選擇「最大失分最小化」的策略，這種想法就導出了「Min-Max 對局搜尋法」，以下是一個範例。

![圖、Min-Max 對局搜尋法的範例](Minimax.jpg)

在上圖中、由於第 0 層代表我方下，所以我們取在第一層失分少的步驟，而第 1 層代表敵方下，所以假設他們也會採取對他們最有利的下法 (也就是對我們最不利的、讓我們失分多的) ，整張圖的推論邏輯就在這種 Min-Max 的過程中完成了。

必須補充說明的是，圖中的 -∞ 與 +∞ 通常代表該節點為樹葉節點，也就是整盤棋已經結束。換句話說、有人輸了或贏了。

演算法： Min-Max 對局搜尋

```javascript
function minimax(node, depth, maximizingPlayer)
    if depth = 0 or node is a terminal node
        return the heuristic value of node
    if maximizingPlayer
        bestValue := -∞
        for each child of node
            val := minimax(child, depth - 1, FALSE))
            bestValue := max(bestValue, val);
        return bestValue
    else
        bestValue := +∞
        for each child of node
            val := minimax(child, depth - 1, TRUE))
            bestValue := min(bestValue, val);
        return bestValue

(* Initial call for maximizing player *)
minimax(origin, depth, TRUE)
```

### Alpha-Beta 修剪法

您可以看到 Min-Max 對每個節點都進行遞迴展開，這種展開的數量是很龐大的，因此即使電腦非常快也展開不了幾層，所以我們必須透過「Alpha-Beta 修剪法」減少展開的數量，以下是一個範例。

![圖、 Alpha-Beta 修剪法的範例](AlphaBetaExample.jpg)

在上圖中，請注意上面 Min 層的 5 節點，您可以看到當該節點最左邊子樹的分數 5 已經計算出來後，由於 5 比 8 還小，因此不管後面的節點分數為多少，都不可能讓其父節點變得比 5 還要大，所以右邊的子樹都可以不用再計算了，這就是 Alpha-Beta 修剪法的原理。

「Alpha-Beta 修剪法」其實是「Min-Max 對局搜尋法」的一個修改版，主要是在 Min-Max 當中加入了 α 與 β 兩個紀錄值，用來做為是否要修剪的參考標準，演算法如下所示。

```javascript
function alphabeta(node, depth, α, β, maximizingPlayer)
     if depth = 0 or node is a terminal node
         return the heuristic value of node
     if maximizingPlayer
         for each child of node
             α := max(α, alphabeta(child, depth - 1, α, β, FALSE))
             if β ≤ α
                 break (* β cut-off *)
         return α
     else
         for each child of node
             β := min(β, alphabeta(child, depth - 1, α, β, TRUE))
             if β ≤ α
                 break (* α cut-off *)
         return β
		 
(* Initial call for maximizing player *)
alphabeta(origin, depth, -∞, +∞, TRUE)
```

### 結語

當然、 Alpha-Beta 修剪法並不保證能將對局樹修剪得非常小，而且樹的大小會與拜訪的順序有關，如果希望樹可以比較小的話，應當從「對我方分數最高、對敵方分數最低」的節點開始處理，這樣才能有效的降低整棵對局搜尋樹的大小。

### 參考文獻
* [Wikipedia:Minimax](http://en.wikipedia.org/wiki/Minimax)
* [Wikipedia:Alpha–beta pruning](http://en.wikipedia.org/wiki/Alpha-beta_pruning)

【本文由陳鍾誠取材並修改自 [維基百科]，採用創作共用的 [姓名標示、相同方式分享] 授權】

