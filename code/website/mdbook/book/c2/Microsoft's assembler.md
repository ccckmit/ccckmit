
# 微軟的組譯器



**簡介**

微軟組譯器 MASM 的執行檔在 Visual Studio 2008 當中稱為 ml.exe，您可以啟動 Visual Studio 的命令列工具，然後使用 ml /Fl 的方式進行組譯，並且同時產生出組譯報表檔。以下是我們組譯 sum.asm 的過程，參數中的 /Fl 選項會導致 ml 組譯器將組譯報表輸出到 sum.lst 檔當中，範例 4.19顯示了該組譯報表的內容。報表檔中顯示了各個指令的編碼與位址、變數的位址、區段的長度等等。

    C:\ccc\SP\code\ch03>ml /Fl sum.asm
    Microsoft (R) Macro Assembler Version 9.00.21022.08
    Copyright (C) Microsoft Corporation.  All rights reserved.

     Assembling: sum.asm
    Microsoft (R) Incremental Linker Version 9.00.21022.08
    Copyright (C) Microsoft Corporation.  All rights reserved.

    /OUT:sum.exe
    sum.obj
**微軟組譯器的報表檔**

先讓我們將焦點鎖定再以下報表檔中的資料段 (.data)，其中的00000000 00000000 sum DWORD 0 這行代表 sum 變數位於資料段的位址 0之處，而從資料段位址00000004 的兩行中，我們可以看到formatStr BYTE "sum=%d", 0dh, 0ah, 0 這行指令被組譯為 73 75 6D 3D 25 64 0D 0A 00。

若將焦點移向程式段 (.code)，我們會看到 MOV eax, 1 指令被編在程式段的位址0之處，其目的碼為 B8 00000001，而ADD sum, eax 之位址為00000005，其目的碼為01 05 00000000。

從報表檔中我們可以清楚的看到 x86 的指令長度是不固定的，像是 ret 0 指令之目的碼為 C3，其長度為 1 bytes，但是CMP eax, 10 指令的目的碼為 83 F8 0A，其長度為 3 bytes，至於ADD sum, eax指令的目的碼為01 05 00000000，其長度達到 6 bytes。

範例：add_print.asm

    Microsoft (R) Macro Assembler Version 9.00.21022.08        09/08/09 12:12:08
    add_print.asm         Page 1 - 1


            .386
            .model  flat
            INCLUDELIB LIBCMT
            printf PROTO C, format:PTR BYTE, args:VARARG
     00000000    .data
     00000000 00000000    num DWORD 0
     00000004 6E 75 6D 3D 25    formatStr BYTE "num=%d", 0dh, 0ah, 0
           64 0D 0A 00
            PUBLIC  _main
     00000000    .code
     00000000    _main   PROC
     00000000  B8 00000001    MOV eax, 1
     00000005  83 C0 04    ADD eax, 4
     00000008  83 E8 02    SUB eax, 2
     0000000B  A3 00000000 R    MOV num, eax
            INVOKE printf, ADDR formatStr, num
     00000023  C3    ret 0
     00000024    _main   ENDP
            END
     Microsoft (R) Macro Assembler Version 9.00.21022.08        09/08/09 12:12:08
     add_print.asm         Symbols 2 - 1




    Segments and Groups:

                    N a m e                 Size     Length   Align   Combine Class

    FLAT . . . . . . . . . . . . . .    GROUP
    _DATA  . . . . . . . . . . . . .    32 Bit  0000000D DWord    Public  'DATA'    
    _TEXT  . . . . . . . . . . . . .    32 Bit  00000024 DWord    Public  'CODE'    


    Procedures, parameters, and locals:

                    N a m e                 Type     Value    Attr

    _main  . . . . . . . . . . . . .    P Near  00000000 _TEXT  Length= 00000024 Public
    printf . . . . . . . . . . . . .    P Near  00000000 FLAT   Length= 00000000 External C


    Symbols:

                    N a m e                 Type     Value    Attr

    @CodeSize  . . . . . . . . . . .    Number  00000000h   
    @DataSize  . . . . . . . . . . .    Number  00000000h   
    @Interface . . . . . . . . . . .    Number  00000000h   
    @Model . . . . . . . . . . . . .    Number  00000007h   
    @code  . . . . . . . . . . . . .    Text    _TEXT
    @data  . . . . . . . . . . . . .    Text    FLAT
    @fardata?  . . . . . . . . . . .    Text    FLAT
    @fardata . . . . . . . . . . . .    Text    FLAT
    @stack . . . . . . . . . . . . .    Text    FLAT
    formatStr  . . . . . . . . . . .    Byte    00000004 _DATA  
    num  . . . . . . . . . . . . . .    DWord   00000000 _DATA  

           0 Warnings
           0 Errors
範例：sum.asm

    Microsoft (R) Macro Assembler Version 9.00.21022.08        09/08/09 12:14:46
    sum.asm         Page 1 - 1


            .386
            .model  flat
            INCLUDELIB LIBCMT
            printf PROTO C, format:PTR BYTE, args:VARARG
     00000000    .data
     00000000 00000000    sum DWORD 0
     00000004 73 75 6D 3D 25    formatStr BYTE "sum=%d", 0dh, 0ah, 0
           64 0D 0A 00
            PUBLIC  _main
     00000000    .code
     00000000    _main   PROC
     00000000  B8 00000001    MOV eax, 1
     00000005    FOR1:
     00000005  01 05 00000000 R    ADD sum, eax
     0000000B  83 C0 01    ADD eax, 1
     0000000E  83 F8 0A    CMP eax, 10
     00000011  7E F2    JLE FOR1
            INVOKE printf, ADDR formatStr, sum
     00000026  C3    ret 0
     00000027    _main   ENDP
            END
     Microsoft (R) Macro Assembler Version 9.00.21022.08        09/08/09 12:14:46
     sum.asm         Symbols 2 - 1




    Segments and Groups:

                    N a m e                 Size     Length   Align   Combine Class

    FLAT . . . . . . . . . . . . . .    GROUP
    _DATA  . . . . . . . . . . . . .    32 Bit  0000000D DWord    Public  'DATA'    
    _TEXT  . . . . . . . . . . . . .    32 Bit  00000027 DWord    Public  'CODE'    


    Procedures, parameters, and locals:

                    N a m e                 Type     Value    Attr

    _main  . . . . . . . . . . . . .    P Near  00000000 _TEXT  Length= 00000027 Public
      FOR1 . . . . . . . . . . . . .    L Near  00000005 _TEXT  
    printf . . . . . . . . . . . . .    P Near  00000000 FLAT   Length= 00000000 External C


    Symbols:

                    N a m e                 Type     Value    Attr

    @CodeSize  . . . . . . . . . . .    Number  00000000h   
    @DataSize  . . . . . . . . . . .    Number  00000000h   
    @Interface . . . . . . . . . . .    Number  00000000h   
    @Model . . . . . . . . . . . . .    Number  00000007h   
    @code  . . . . . . . . . . . . .    Text    _TEXT
    @data  . . . . . . . . . . . . .    Text    FLAT
    @fardata?  . . . . . . . . . . .    Text    FLAT
    @fardata . . . . . . . . . . . .    Text    FLAT
    @stack . . . . . . . . . . . . .    Text    FLAT
    formatStr  . . . . . . . . . . .    Byte    00000004 _DATA  
    sum  . . . . . . . . . . . . . .    DWord   00000000 _DATA  

           0 Warnings
           0 Errors
另外，範例 4.19的報表檔中也顯示了符號表的內容，像是 FOR1標記的位址為 _TEXT 段的 00000005，formatStr 變數的位址為 _DATA 段的 00000004，而 sum 的位址則為 _DATA 段的 00000000 等等。仔細觀察這些報表檔，您將會更瞭解組譯器的設計原理，以及 x86 的指令集架構。 Help | Terms of Service | Privacy | Report a bug | Flag as objectionable Powered by Wikidot.com Unless otherwise stated, the content of this page is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License Other interesting sites