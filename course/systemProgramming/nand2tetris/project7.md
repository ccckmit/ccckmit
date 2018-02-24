# 第七章習題說明

工具中有 VMEmulator (.sh, .bat) 可以用。

啟動後若選擇開啟 Load Program/xxx.vm 可以一步一步執行，觀察結果！

若選擇開啟 Load Test/xxxVME.tst ，可以觀察該測試程式的標準輸出結果。

學習者必須撰寫『xxx.vm => xxx.asm』的轉換程式，寫好之後開啟 Load Test/xxx.tst ，
看看這些測試是否成功，若成功就代表你已經正確地完成該習題。

例如 SimpleAdd.tst 裡面的內容如下，該測試會開啟 SimpleAdd.asm 檔案（你的虛擬機程式必需將 SimpleAdd.vm 轉為 SimpleAdd.asm)，然後才可以用這個測試去測。

```
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/07/StackArithmetic/SimpleAdd/SimpleAdd.tst

load SimpleAdd.asm,
output-file SimpleAdd.out,
compare-to SimpleAdd.cmp,
output-list RAM[0]%D2.6.2 RAM[256]%D2.6.2;

set RAM[0] 256,  // initializes the stack pointer 

repeat 60 {      // enough cycles to complete the execution
  ticktock;
}

output;          // the stack pointer and the stack base
```

對於每一題，你在完成轉換 xxx.vm => xxx.asm 的程式後，就可以用 VMEmulator 測試看看是否成功！