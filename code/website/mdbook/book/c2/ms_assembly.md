## 組合語言 -- 微軟的範例

在電腦越來越發達的時代，程式設計師與組合語言的距離就越來越遠了，這往往讓我們不知道如何在個人電腦上撰寫組合語言。對於那些曾經碰過 DOS 系統的人而言，撰寫組合語言是常見的事情，但是自從 Windows 加入保護功能之後，這些 DOS 的組合語言就再也不能執行了，要在 Windows 系統下撰寫組合語言，成了一種很少人會的絕技。

但是，其實在 MS. Windows 之下撰寫組合語言並沒有那麼困難。要在微軟的平台上撰寫組合語言，最簡單的方式是安裝 Visual Studio Professional，然後啟動 Visual Studio 的命令列工具，舉例而言，在筆者的電腦上安裝有 Windows XP + Visual Studio Professional 2008，筆者只要啟動「開始/所有程式/Microsoft Visual Studio 2008/Visual Studio Tools/Visual Studio 2008 命令提是字元」後，就可以打入 ml 指令看看是否具有微軟的組譯器 ml.exe，如下圖所示。

![[圖一、測試微軟的組譯器是否存在]](ml.png)

一但有了這個組譯器，您就可以開始撰寫微軟的組合語言了，以下是一些組合語言的程式範例，以及筆者的執行情況。

### 範例一、加減法

檔案：add.asm

```
.386
.model	flat
INCLUDELIB LIBCMT
printf PROTO C, format:PTR BYTE, args:VARARG
.data
num DWORD 0
formatStr BYTE "num=%d", 0dh, 0ah, 0
PUBLIC	_main
.code
_main	PROC
    MOV eax, 1
    ADD eax, 4
    SUB eax, 2
    MOV num, eax
    INVOKE printf, ADDR formatStr, num
    ret	0
_main	ENDP
END
```

執行結果

```
D:\code\ASM>ml add.asm
Microsoft (R) Macro Assembler Version 9.00.21022.08
Copyright (C) Microsoft Corporation.  All rights reserved.

 Assembling: add.asm
Microsoft (R) Incremental Linker Version 9.00.21022.08
Copyright (C) Microsoft Corporation.  All rights reserved.

/OUT:add.exe
add.obj

D:\code\ASM>add
num=3

```

### 範例二、計算總和

檔案：sum.asm
```
.386
.model	flat
INCLUDELIB LIBCMT
printf PROTO C, format:PTR BYTE, args:VARARG
.data
sum DWORD 0
formatStr BYTE "sum=%d", 0dh, 0ah, 0
PUBLIC	_main
.code
_main	PROC
    MOV eax, 1
FOR1:
    ADD sum, eax
    ADD eax, 1
    CMP eax, 10
    JLE FOR1
    INVOKE printf, ADDR formatStr, sum
    ret	0
_main	ENDP
END
```

執行結果

```
D:\code\ASM>ml sum.asm
Microsoft (R) Macro Assembler Version 9.00.21022.08
Copyright (C) Microsoft Corporation.  All rights reserved.

 Assembling: sum.asm
Microsoft (R) Incremental Linker Version 9.00.21022.08
Copyright (C) Microsoft Corporation.  All rights reserved.

/OUT:sum.exe
sum.obj

D:\code\ASM>sum
sum=55
```