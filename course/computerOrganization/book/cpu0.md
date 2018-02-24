## CPU0 指令集

CPU0 是一個簡易的 32 位元單匯流排處理器，其架構如下圖所示，包含R0..R15, IR, MAR, MDR 等暫存器，其中 IR是指令暫存器，
R0 是一個永遠為常數 0 的唯讀暫存器，R15 是程式計數器 (Program Counter : PC)，R14 是連結暫存器 (Link Register : LR)，
R13 是堆疊指標暫存器 (Stack Pointer : SP)，而 R12 是狀態暫存器 (Status Word : SW)。

![圖、CPU0 的架構圖](../img/cpu0architecture.jpg)

CPU0 包含『載入儲存』、『運算指令』、『跳躍指令』、『堆疊指令』等四大類指令，以下表格是 CPU0 的指令編碼表，記載了 CPU0 的指令集與每個指令的編碼。

格式    指令        OP      說明                     語法                       語意
-----   ---------   ------  ---------------------    --------------------       ---------------------
L       LD          00      載入word                 LD  Ra, [Rb+Cx]             Ra=[Rb+Cx]
L       ST          01      儲存word                 ST  Ra, [Rb+Cx]             Ra=[Rb+Cx]
L       LDB         02      載入 byte                LDB Ra, [Rb+Cx]             Ra=(byte)[Rb+Cx]
L       STB         03      儲存 byte                STB Ra, [Rb+Cx]             Ra=(byte)[Rb+Cx]
A       LDR         04      LD的暫存器版             LDR Ra, [Rb+Rc]             Ra=[Rb+Rc]
A       STR         05      ST的暫存器版             STR Ra, [Rb+Rc]             Ra=[Rb+Rc]
A       LBR         06      LDB的暫存器版            LBR Ra, [Rb+Rc]             Ra=(byte)[Rb+Rc]
A       SBR         07      STB的暫存器版            SBR Ra, [Rb+Rc]             Ra=(byte)[Rb+Rc]
L       LDI         08      載入常數                 LDI Ra, Cx                  Ra=Cx
A       CMP         10      比較                     CMP Ra, Rb                  SW=Ra >=< Rb
A       MOV         12      移動                     MOV Ra, Rb                  Ra=Rb
A       ADD         13      加法                     ADD Ra, Rb, Rc              Ra=Rb+Rc
A       SUB         14      減法                     SUB Ra, Rb, Rc              Ra=Rb-Rc
A       MUL         15      乘法                     MUL Ra, Rb, Rc              Ra=Rb*Rc
A       DIV         16      除法                     DIV Ra, Rb, Rc              Ra=Rb/Rc
A       AND         18      邏輯 AND                 AND Ra, Rb, Rc              Ra=Rb and Rc
A       OR          19      邏輯 OR                  OR Ra, Rb, Rc               Ra=Rb or Rc
A       XOR         1A      邏輯 XOR                 XOR Ra, Rb, Rc              Ra=Rb xor Rc
A       ADDI        1B      常數加法                 ADDI Ra, Rb, Cx             Ra=Rb + Cx
A       ROL         1C      向左旋轉                 ROL Ra, Rb, Cx              Ra=Rb rol Cx
A       ROR         1D      向右旋轉                 ROR Ra, Rb, Cx              Ra=Rb ror Cx
A       SHL         1E      向左移位                 SHL Ra, Rb, Cx              Ra=Rb << Cx
A       SHR         1F      向右移位                 SHR Ra, Rb, Cx              Ra=Rb >> Cx
J       JEQ         20      跳躍 (相等)              JEQ Cx                      if SW(=)  PC=PC+Cx
J       JNE         21      跳躍 (不相等)            JNE Cx                      if SW(!=) PC=PC+Cx
J       JLT         22      跳躍 (<)                 JLT Cx                      if SW(<)  PC=PC+Cx
J       JGT         23      跳躍 (>)                 JGT Cx                      if SW(>)  PC=PC+Cx
J       JLE         24      跳躍 (<=)                JLE Cx                      if SW(<=) PC=PC+Cx
J       JGE         25      跳躍 (>=)                JGE Cx                      if SW(>=) PC=PC+Cx
J       JMP         26      跳躍 (無條件)            JMP Cx                      PC=PC+Cx
J       SWI         2A      軟體中斷                 SWI Cx                      LR=PC; PC=Cx; INT=1
J       CALL        2B      跳到副程式               CALL Cx                     LR=PC; PC=PC+Cx
J       RET         2C      返回                     RET                         PC=LR
J       IRET        2D      中斷返回                 IRET                        PC=LR; INT=0
A       PUSH        30      推入word                 PUSH Ra                     SP-=4; [SP]=Ra;
A       POP         31      彈出 word                POP Ra                      Ra=[SP]; SP+=4;
A       PUSHB       32      推入 byte                PUSHB Ra                    SP--; [SP]=Ra; (byte)
A       POPB        33      彈出 byte                POPB Ra                     Ra=[SP]; SP++; (byte)

### CPU0 指令格式

CPU0 所有指令長度均為 32 位元，這些指令也可根據編碼方式分成三種不同的格式，分別是 A 型、J 型與 L 型。

大部分的運算指令屬於A (Arithmatic) 型，而載入儲存指令通常屬於 L (Load & Store) 型，跳躍指令則通常屬於 J (Jump) 型，
這三種型態的指令格式如下圖所示。

![圖、CPU0的指令格式](../img/cpu0format.jpg)

### 狀態暫存器

R12 狀態暫存器 (Status Word : SW) 是用來儲存 CPU 的狀態值，這些狀態是許多旗標的組合。例如，零旗標 (Zero，簡寫為Z) 
代表比較的結果為 0，負旗標 (Negative ，簡寫為N) 代表比較的結果為負值，另外常見的旗標還有進位旗標 (Carry ，簡寫為 C)，
溢位旗標 (Overflow，簡寫為 V) 等等。下圖顯示了 CPU0 的狀態暫存器格式，最前面的四個位元 N、Z、C、V所代表的，
正是上述的幾個旗標值。

![圖、CPU0 中狀態暫存器 SW 的結構](../img/cpu0sw.jpg)

條件旗標的 N、Z 旗標值可以用來代表比較結果是大於 (>)、等於 (=) 還是小於 (<)，當執行 CMP Ra, Rb 動作後，會有下列三種可能的情形。

1. 若 Ra > Rb，則 N=0, Z=0。
2. 若 Ra < Rb，則 N=1, Z=0。
3. 若 Ra = Rb，則 N=0, Z=1。

如此，用來進行條件跳躍的 JGT、JGE、JLT、JLE、JEQ、JNE指令，就可以根據 SW 暫存器當中的 N、Z 等旗標決定是否進行跳躍。

SW 中還包含中斷控制旗標 I (Interrupt) 與 T (Trap)，用以控制中斷的啟動與禁止等行為，假如將 I 旗標設定為 0，則CPU0將禁止所有種類的中斷，也就是對任何中斷都不會起反應。但如果只是將 T 旗標設定為0，則只會禁止軟體
中斷指令 SWI (Software Interrupt)，不會禁止由硬體觸發的中斷。

SW 中還儲存有『處理器模式』的欄位，M=0 時為『使用者模式』 (user mode) 與 M=1 時為『特權模式』(super mode) 等，
這在作業系統的設計上經常被用來製作安全保護功能。在使用者模式當中，任何設定狀態暫存器 R12 的動作都會被視為是非法的，
這是為了進行保護功能的緣故。但是在特權模式中，允許進行任何動作，包含設定中斷旗標與處理器模式等位元，
通常作業系統會使用特權模式 (M=1)，而一般程式只能處於使用者模式 (M=0)。

### 位元組順序

CPU0 採用大者優先 (Big Endian) 的位元組順序 (Byte Ordering)，因此代表值越大的位元組會在記憶體的前面 (低位址處)，代表值小者會在高位址處。

由於 CPU0 是 32 位元的電腦，因此，一個字組 (Word) 占用 4 個位元組 (Byte)，因此，像 LD R1, [100] 這樣的指令，其實是將記憶體 100-103 中的字組取出，存入到暫存器 R1 當中。

LDB 與 STB 等指令，其中的 B 是指 Byte，因此，LDB R1, [100] 會將記憶體 100 中的 byte 取出，載入到 R1 當中。但是，由於 R1 的大小是 32 bits，相當於 4個 byte，此時，LDB 與 STB 指令到底是存取四個 byte 當中的哪一個byte呢？這個問題的答案是byte 3，也就是最後的一個 byte。 


### 中斷程序

CPU0 的中斷為不可重入式中斷，其中斷分為軟體中斷 SWI (Trap) 與硬體中斷 HWI (Interrupt) 兩類。

硬體中斷發生時，中段代號 INT_ADDR 會從中段線路傳入，此時執行下列動作：

1. LR=PC; INT=1
2. PC=INT_ADDR

軟體中斷 SWI Cx 發生時，會執行下列動作：

1. LR=PC; INT=1
2. PC=Cx; 

中斷最後可以使用 IRET 返回，返回前會設定允許中斷狀態。

1. PC=LR; INT=0

