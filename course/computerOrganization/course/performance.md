# 處理器效能

* [現代處理器設計](http://hackfoldr.org/cpu/) -- jserv

```
CPU 時間 = CPU 執行一個指令所需的時脈週期 / 時脈頻率

CPI = CPU 執行一個指令所需的時脈週期 / 指令數

CPU 時間 = 指令數 * 每個指令週期數 * 時脈週期時間
```

# 安達荷定理 (Amdahl's Law)

改善一系統的某部分以提升效能之時，其改善程度會受限於「該部分所佔的時間比率」。

```
    S = 1/(1-f)+f/k

S : 整體系統的改善比率。
f: 改善部分的比率。
k: 該部分系統改善後的效能增加倍數。
```

## RISC 精簡指令集電腦

使用管線 (Pipeline) 讓電腦加速

* 管線 CPI = 理想管線 CPI + 結構暫停值 + 資料違障暫停值 + 流程控制暫停值

## 動態排程 

Tomasulo 演算法

## 利用快取增加速度

* 目錄性快取一致性協定

## 記憶體階層 (Memory Hierarchy)

* 記憶裝置
 * SRAM
 * DRAM
 * 磁碟機

* 分頁式虛擬記憶體
 * TLB : Translate Look aside Buffer

* 輸出入系統
 * RAID : 磁碟陣列
