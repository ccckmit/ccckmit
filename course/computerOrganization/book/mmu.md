# 記憶體管理單元 (MMU)

記憶體的管理，有些部份可以用純軟體的方式設計，像是「自動記憶體分配」(Automatic memory allocation) (C 語言的 malloc、new 等)、「垃圾回收機制」(Garbage collection)、Linux 與 FreeBSD 中的 [Slab_allocation](http://en.wikipedia.org/wiki/Slab_allocation) 分配機制等等，都可以直接用程式處理掉，不需要處理器的特別設計去支援。

但是、有些記憶體的管理，是需要「處理器特別支援的」，像是「虛擬記憶體技術」(Virtual Memory)，就需要在處理器中特別加入分頁表 (Page Table) 的機制，然後讓作業系統 (OS) 透過分頁表的設定與管理，適時的將某些分頁換出到硬碟中，在需要的時候再將這些分頁換入，這種功能就稱為需求分頁。

![圖、記憶體管理單元 MMU<BR/>來源：http://en.wikipedia.org/wiki/Memory_management_unit#mediaviewer/File:MMU_principle_updated.png](../img/MMU_principle_updated.png)

通常我們所說的「記憶體管理單元」 (MMU, Memory Management Unit)，是指上述的這種分頁與位址轉換機制。

但是、有些記憶體的管理機制，是作業系統不需要介入，處理器會自行安排的，像是處理器內部用快速記憶體做為 DRAM 的快取時，就不需要作業系統的介入，處理器會自行透過「關聯快取」(associative cache) 的機制完成整個快取動作，作業系統不需要也無法介入此一過程。

![圖、關聯式快取機制 (Associative Cache)<BR/>來源：http://en.wikipedia.org/wiki/CPU_cache#mediaviewer/File:Cache,associative-fill-both.png](../img/Cache-associative-fill-both.png)

不過、如果廣義的來看，那些不需要作業系統介入，只需要處理器就能完成的「記憶體管理」硬體，也可以說是 MMU 的一部分。

![圖、AMD Athlon 處理器的記憶體管理設計<BR/>來源：http://en.wikipedia.org/wiki/File:Cache,hierarchy-example.svg](../img/Athlon_CPU_cache.jpg)

