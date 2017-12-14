## 編譯指示 -- #pragma, _Pragma(), GCC dependency, GCC poison, …

編譯指示 #pragma 是用來告知編譯器某些特殊指示，例如不要輸出錯誤訊息，抑制警告訊息，或者加上記憶體漏洞檢查機制等。這些指示通常不是標準的 C 語言所具備的，而是各家編譯器廠商或開發者所制定的，以便讓編譯器可以具有某些特殊的選項。

舉例而言，#pragma STDC 就可以用來要求編譯器採用標準 C 的語法進行編譯，只要看到有任何不符合標準 C 的語法，編譯器就會輸出錯誤。

**#Pragma message**

```    
    #ifdef _X86 
    #Pragma message("_X86 defined")  // 在編譯時輸出 _X86 defined
    #endif
** #Pragma warning**

    #pragma warning( once:37 43; disable:32; error:17) // 37,43 只警告一次，不警告 32 號資訊，17 號警告視為錯誤

    #pragma warning( push )  // 保存目前警告狀態
    #pragma warning( once:37 43)
    #pragma warning( disable:32 ) 
    #pragma warning( error:17 ) 
    ....... 
    #pragma warning( pop ) // 恢復先前的警告狀態
    #pragma warn -100 // Turn off the warning message for warning #100 
    int insert_record(REC *r) {
     ...
    }
    #pragma warn +100 // Turn the warning message for warning #100 back on 
**#Pragma once**

    #pragma once // 保證引用檔 (*.h) 只會被引用一次，如此就不需要用「引入防護」了。
**#Pragma code_seg**

    #Pragma code_seg(["section-name"][,"section-class"])
    #pragma code_seg("INIT")  // 設定存放於 INIT 區段，開發驅動程式時會用到
    extern"C"   
    void DriverEntry(...)  { ... }
**#pragma hdrstop**

    #pragma hdrstop // 表示引用檔編繹到此為止，以加快編譯速度。
**#pragma startup**

    #pragma startup <func> <priority> 
    #pragma exit <func> <priority>  
----
void india();
void usa() ;
#pragma startup india 105
#pragma startup usa
#pragma exit usa
#pragma exit india 105
void main() { printf("\nI am in main"); getch(); }
void india() { printf("\nI am in india"); getch(); }
void usa() { printf("\nI am in usa"); getch(); }
```

**執行結果**

```
    I am in usa
    I am in India
    I am in main
    I am in India
    I am in usa
```
    
**#pragma package(...)**

    #pragma package(smart_init) // 使用某套編譯指引 (在 BCB 中，根據優先級的大小先後編譯) 
**#pragma resource "..."**

    #pragma resource "*.dfm" // 把*.dfm 資源檔加入專案。

**#pragma loop_opt(...)**


每個編譯程式可以用#pragma指令激活或終止該編譯程式支援的一些編譯功能。例如，對迴圈優化功能：

    #pragma loop_opt(on) // 啟動迴圈最佳化
    #pragma loop_opt(off) // 停止迴圈最佳化
**#pragma asm**

    #pragma asm // 代表後面寫的是組合語言 (Microsoft)
**#pragma small**

    #pragma small // 使用小記憶體模式 (Microsoft X86)
**#pragma registerbank(..)**

    #pragma registerbank(0) // 使用 8031 處理器中的 bank0 (Keil C)
    #pragma code

    #pragma code // 表示唯讀資料應儘可能放在 ROM 裡以節省 RAM (Keil C)

**參考文獻**

　　pragma 預處理指令 -- http://topalan.pixnet.net/blog/post/22334686