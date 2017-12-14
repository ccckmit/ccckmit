# 計算機結構

* [超執行緒 (Hyper-threading, HT)](https://zh.wikipedia.org/wiki/%E8%B6%85%E5%9F%B7%E8%A1%8C%E7%B7%92)
  * 在一個實體CPU中，提供兩個邏輯執行緒。(兩組暫存器等資源，切換時可以很快)
  * 英特爾表示，超執行緒技術讓Pentium 4 HT處理器增加5%的裸晶面積，就可以換來15%~30%的效能提升。


## 我的 Acer XC-704 的電腦 (2017/12/7)

用的是 [Intel Celeron J3160](https://www.intel.com.tw/content/www/tw/zh/products/processors/celeron/j3160.html), 1.60 GHZ 的處理器。(2M 快取記憶體，最高 2.24 GHz)

更詳細的規格

屬性 | 說明
-----|------------------
number of Cores | 4
Burst Frequency | 2240.0
number of Threads | 4
Processor Base Frequency  | 1.60 GHz
TDP | 6.0 W
Cache 2 MB | L2


Intel 處理器的規格系列網頁如下

* https://www.intel.com.tw/content/www/tw/zh/products/processors.html

其中 Intel® Celeron® 處理器的描述為：

* 以可靠效能與實惠價格支援基本消費型應用、HD 影音及網頁瀏覽。

這代表是陽春型的。

* [Celeron、Pentium、Core、Xeon他们区别在哪里 那个最好？](https://zhidao.baidu.com/question/63135329.html)

[Celeron]:https://zh.wikipedia.org/wiki/%E8%B5%9B%E6%89%AC
[Pentium]:https://zh.wikipedia.org/wiki/%E5%A5%94%E9%A8%B0
[Core]:https://zh.wikipedia.org/wiki/%E9%85%B7%E7%9D%BF
[Xeon]:https://zh.wikipedia.org/wiki/%E8%87%B3%E5%BC%BA

* [Celeron] 是 Intel 的低端产品，俗称垃圾产品，特点是便宜、性能差。
* [Pentium] 是 Intel 的高端产品（2004年前是这样）。
* [Core] 是 Intel 的主流产品，特点是目前的主流，有低端的也有高端的。
* [Xeon] 是 Intel 目前的最强的产品，特点是服务器使用，当然个人也可以使用，它也包括高端与低端，它的高端，是目前性能最强的CPU。

## GPU

* http://www.nvidia.com.tw/object/what-is-gpu-computing-tw.html
  * 比較 CPU 和 GPU 處理任務的方式，就可輕鬆瞭解兩者之間的差異。CPU 含有數顆核心，用來為循序的序列處理進行最佳化。GPU 則含有數千個更小型且更高效率的核心，專為同時處理多重任務進行最佳化。


## Google TPU (tensor processing unit)


* [Google 硬體工程師揭密，TPU 為何會比 CPU、GPU 快 30 倍](https://technews.tw/2017/04/07/first-in-depth-look-at-googles-tpu-architecture/)
* [Google 張量處理器](https://zh.wikipedia.org/wiki/%E5%BC%A0%E9%87%8F%E5%A4%84%E7%90%86%E5%99%A8)
* [Google 說 TPU 比 GPU 更厲害，Nvidia 便亮出 Tesla V100 予以顏色](https://technews.tw/2017/05/12/nvidia-give-tesla-v100-to-google/)
