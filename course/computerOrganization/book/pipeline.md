## 流水線架構 (Pipeline) 

Pipeline 是一種讓指令分成幾個步驟，然後兩個指令的不同步驟可以「瀑布式重疊」的方法。

舉例而言、假如我們將一個指令的執行分為五個步驟如下：

1. 擷取 F (Fatch)
2. 解碼 D (Decode)
3. 計算 C (Compute)
4. 存取 M (Memory Access)
5. 寫回 W (Write Back)

那麼在理想的情況下，我們就能夠讓這些指令充分的重疊執行，如下圖所示。

![圖、理想的 Pipeline 執行情況](../img/Pipeline1.jpg)

如此、只要讓每個步驟所需的時間幾乎一樣，然後將 Clock 調快五倍，就能讓速度整整加快五倍。

這就是所謂的 Pipeline 流水線架構的原理。

然而、流水線架構的處理器設計比較困難，因為上圖的理想情況畢竟只是理想，現實生活中有很多因素會干擾流水線的運行，造成流水線某個階段受到阻礙無法完成，必須暫停等後某個步驟完成，這種暫停會形成流水線當中的氣泡 (bubble)，這種情況統稱為「指令圍障」 (instruction hazard)。

Hazard 有好幾種，像是資料圍障 (data hazard)、快取失敗 (cache miss)、分支延遲 (branch penalty) 等等。

流水線架構的設計，通常必須用暫存器圍牆 (Register wall) 將每個步驟之間相互隔開，以避免線路之間的干擾，如下所示：

![圖、以暫存器圍牆分隔流水線架構的每個階段](../img/pipeline_register_wall.jpg)

Pipeline 處理器最困難的地方，就是要盡可能的減少這些 hazard。然而、有些 hazard 是可以用硬體方式消除的，但是很多 hazard 的消除卻是需要編譯器的配合才能夠做得到。

透過編譯器的協助減少 hazard 的方法，包括「指令重排、插入 NOP 指令、分支預測」等等。

想要進一步瞭解流水線架構細節的讀者，可以參考下列文件。

* [維基百科：流水線](http://zh.wikipedia.org/wiki/%E7%AE%A1%E7%B7%9A)
* [維基百科：指令管線化](http://zh.wikipedia.org/wiki/%E6%8C%87%E4%BB%A4%E7%AE%A1%E7%B7%9A%E5%8C%96)
* [維基百科：分支預測器](http://zh.wikipedia.org/wiki/%E5%88%86%E6%94%AF%E9%A0%90%E6%B8%AC%E5%99%A8)




