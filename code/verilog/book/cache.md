## 快取記憶體 (Cache) 

傳統的處理器通常採用「單一匯流排馮紐曼架構」設計，這種架構非常簡單且易懂，如下圖所示：

![圖、單一匯流排的馮紐曼架構](../img/voneumann1bus.jpg)

但是、以當今的技術，上圖中的記憶體通常採用 DRAM 為主。

這是因為快速的靜態記憶體 (SRAM) 仍然相當昂貴，而速度慢上數十倍的動態記憶體 (DRAM) 則相對便宜，因此電腦的主記憶體通常仍然採用 DRAM 為主。

如果要讓 CPU 的執行速度更快，就不能讓 CPU 遷就於 DRAM 的速度跟著變慢，此時我們可以在 CPU 內部加入一個快取記憶體 (cache)，讓位於 DRAM 中常用到的指令與資料放入快取當中，如下圖所示：

![圖、單一匯流排的馮紐曼架構](../img/voneumann1cache.jpg)

當 CPU 想要執行一個指令時，如果該指令已經在 cache 當中，就不需要讀取 DRAM，因此「指令擷取」階段就可以快上數十倍。

當然、如果該指令需要存取資料，而該資料已經在 cache 當中了，那麼 CPU 就不需要從 DRAM 中讀取資料，因此「資料讀取」階段就可以快上數十倍。

當需要寫入資料時，如果暫時先寫到 cache 當中，而不是直接寫回 DRAM，那麼「資料寫入」的動作就可以快上數十倍。

當然、上述的美好情況不會永遠都成立，假如想存取的指令或資料不存在 cache 當中，那麼就必須從 DRAM 讀取資料，這時 CPU 的速度就會被打回原形，變成與 DRAM 的速度一樣。

而且、當資料被放入 cache 之後，由於 DRAM 當中還有一份同樣的資料，要又如何才能快速的查出資料是否在 cache 當中，就是一個不容易的問題了。這個問題的解決，必須依靠某種「記憶體位址的標籤」 (tag)，透過這種標籤我們可以查出某個位址的內容到底是在 cache 當中的那一格。

而標籤的設計方法，大致可分為「直接映射」 (direct-mapping)，「關連映射」(associate-mapping)與「組關連映射」 (set associative-mapping) 等幾種方法。其中最常採用的是後者。

Cache 技術是現代電腦能夠快速執行的一個重要原因，因為 CPU 的速度比 DRAM 記憶體快上數十倍到百倍，而 DRAM 的速度又比硬碟快上數十倍到百倍，因此若沒有依賴快取的話，現代電腦就不能達到「記憶容量又大，執行速度又快」的功能了。

![圖、記憶體階層與快取機制](../img/hierarchy.jpg)

處理器內部的靜態記憶體 SRAM 可以作為外部動態記憶體 DRAM 的快取，而動態記憶體又可以作為硬碟的快取。

快取的運作通常必須要依靠「一個查詢表格」與「對應的小區塊儲存空間」，在處理器內部，用來作為「查詢表格」的稱為 TLB (translation lookaside buffer)， TLB 可以用來記錄哪些 DRAM 區塊被放入到處理器中了，如此才能透過 TLB 查詢某個記憶體位址的資料是否在處理器快取中，如果發現在快取中，就可以直接取用，否則就會引發快取失誤 (cache miss) ，產生中斷並載入所需要的 DRAM 區塊到快取當中。

![圖、處理器、記憶體、硬碟之間的快取關係](../img/voneumann1cache_disk.jpg)

另外、在「計算機結構」與「作業系統」領域都會談論到的「虛擬記憶體技術」(Virtual Memory)，則是用 DRAM 作為硬碟的快取，此時的「查詢表格」稱為「需求分頁表」 (Page Table)，作業系統可以透過 Page Table 查詢某個分頁是否在記憶體中 (如果不在記憶體中就是被換出去到硬碟裏儲存了)，當需要的分頁不再記憶體中，而是在硬碟裏時，就會引發分頁失誤 (page fault)，然後產生中斷去載入該分頁到記憶體中之後，該記憶體存取與行程 (Process) 才能再繼續執行。

對這些 cache 作法的細節有興趣的讀者，可以參考下列文件。

快取的概念：

* [Wikipedia:Cache_Computing]
* [Wikipedia:Cache](http://en.wikipedia.org/wiki/Cache)
* [Wikipedia:Memory_management](http://en.wikipedia.org/wiki/Memory_management)

處理器的快取：用 SRAM 作為 DRAM 的 Cache

* [Wikipedia:CPU_cache](http://en.wikipedia.org/wiki/CPU_cache)
* [維基百科:CPU快取](http://zh.wikipedia.org/wiki/CPU%E7%BC%93%E5%AD%98)

虛擬記憶體與分頁表：用 DRAM 作為硬碟的 Cache

* [Wikipedia:Page_Table](http://en.wikipedia.org/wiki/Page_table)
* [維基百科:分頁表](http://zh.wikipedia.org/wiki/%E5%88%86%E9%A0%81%E8%A1%A8)
* [Wikipedia:Demand_paging](http://en.wikipedia.org/wiki/Demand_paging)
* [Wikipedia:Virtual_memory](http://en.wikipedia.org/wiki/Virtual_memory)
* [維基百科:虛擬記憶體](http://en.wikipedia.org/wiki/Virtual_memory)
* [Wikipedia:Paging](http://en.wikipedia.org/wiki/Paging)
* [維基百科:分頁](http://zh.wikipedia.org/wiki/%E5%88%86%E9%A0%81)
* [Wikipedia:Translation_lookaside_buffer](http://en.wikipedia.org/wiki/Translation_lookaside_buffer)
* [維基百科:TLB](http://zh.wikipedia.org/wiki/TLB)

[Wikipedia:Cache_Computing]:http://en.wikipedia.org/wiki/Cache_(computing)

但是、雖然快取可以提高速度，但是當快取容量不足的時候，有可能會產生「顛簸」(Thrashing) 的現像，也就是某些快取不斷的被移入後又移出，導致速度變得非常緩慢的現像。

因此、快取並不能保證電腦的速度一定會變快，在快取不足的情況之下，電腦有可能反而會變得比沒有快取的情況下更慢，這是在設計快取機制時必須要小心應對的問題。(但是這個問題通常無法徹底解決，這也是為何很多系統在尖峰時間會呈現當機狀態與系統崩潰的主要原因)。



