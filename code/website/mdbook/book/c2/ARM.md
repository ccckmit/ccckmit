## ARM 處理器的架構

ARM處理器是一顆在手機上常用的處理器，其特色為相當省電，本書中的CPU0也是從ARM處理器簡化而來的。圖一顯示了ARM的處理器架構，這個架構與 CPU0 的架構相當類似。但在ALU與暫存器上有少許不同點。

ARM是精簡指令集 (Reduced Instruction Set Computer : RISC) 的處理器，RISC 的特色是使用管線 (Pipeline) 的方式增進速度，但是在不屬於指令載入期間，進行記憶體存取會破壞管線的可重疊性。因此，在RISC處理器通常會禁止運算指令直接存取記憶體，只允許載入儲存指令存取記憶體。在這點上，CPU0 的指令集也可說是一種精簡指令集。因為在 CPU0 中也只有載入儲存指令可以存取記憶體。

![[圖一、ARM 處理器的架構]](ARM_architecture.jpg)

圖一的 ALU 右上方，還有一個滾筒移位器 (Barrel Shifter)，該移位器可在指令進入 ALU 前先作移位的動作，這使得 ARM 不需要特別的移位指令，每個運算指令都可以附加移位功能。例如，ADD R1, R2, R3 LSL #3 指令，就在加法運算之前先進行移位，這樣就節省了一個指令，增快了程式的執行速度。

### ARM 的暫存器
ARM 的可存取暫存器為 R0-R15，其中 R13為堆疊指標 SP (Stack Pointer)，R14 為連結暫存器 LR (Link Register)，R15 為程式計數器 PC (Program Counter)。

ARM的狀態暫存器有 CPSR (Current Processor Status Register) 與 SPSR (Saved Processor Status Register)。其中 SPSR 乃是在中斷時用來自動儲存CPSR的暫存器。

在 ARM 處理器當中，共有七種模式，包含 1. 使用者模式 (User Mode)  2. 系統模式 (System Mode)、3. 快速中斷模式 (Fast Interrupt Request:FIQ)、4. 特權呼叫模式(Superviser Call:SVC)、5. 中止模式(Abort:ABT)、6. 中斷請求模式 (Interrupt Request:IRQ)、7. 未定義模式(Undefine:Undef) 等。

不同的模式會有獨立的堆疊暫存器 SP (R13) 與連結暫存器 LR (R14)，這使得 ARM 的模式切換更快，因為不需要以額外的指令儲存這些暫存器。圖二顯示了 ARM 當中的所有暫存器，在每個模式當中，R0-R15 及 CPSR 都是可以存取的，但在後五種模式中，會使用獨立的 R13, R14、以及 SPSR，取代使用者模式的暫存器。

![[圖二、ARM 各種模式下的暫存器]](ARM_register.jpg)

當快速中斷發生時，ARM 處理器會自動將狀態暫存器 CPSR 放入 SPSR_fiq，並將R15(PC) 放入 R14_fiq(LR) 中，這有點像副程式呼叫時的作法。另外，由於快速中斷模式中，R8_fiq-R14_fiq 被用來取代 R8-R14，這使得 R8_fiq-R14_fiq這七個暫存器可以直接被寫入，而不需要特別保存，有利於縮短快速中斷的時間。圖三顯示了 ARM 的快速中斷機制之原理。

![[圖三、ARM 的快速中斷機制]](ARM_fiq.jpg)

### ARM 的狀態暫存器 (CPSR, SPSR)
狀態暫存器 CPSR 與 SPSR的結構如圖四所示，除了用來儲存條件旗標之外，還有中斷控制位元 I、F，可用來允許或禁止中斷，狀態位元 T 用來記錄處理器是位於正常 (ARM:指令為32位元) 或精簡 (Thumb:指令為16位元) 狀態，處理器模式 Mode 是用來記錄處理器的模式，像是 (User / System / FIQ / SVC / ABT / IRQ / Undef) 等。

![[圖四、ARM 的狀態暫存器結構]](ARM_CPSR.jpg)

### ARM 的指令格式

ARM的指令格式如圖五所示，其中，位於31-28 位元的 Cond 欄位，是指令前置條件欄，因此每個 ARM 指令都是條件式執行的，這使得 ARM 不需要有像 CPU0 一樣多的條件跳躍指令 (像是 JEQ、JNE、JGT、JGE、JLT、JLE 等)。因此，ARM 的跳躍類指令只有 B、BL、BX 等三個，其中 BL 是會儲存程式計數器 PC到 LR 當中的跳躍，通常用來進行副程式的呼叫，而 BX 則是會儲存狀態暫存器的跳躍。

![[圖五、ARM 指令的一般格式]](ARM_format.jpg)

### ARM的指令集

表格一顯示了ARM處理器的指令表，包含運算、記憶體、分支與其他等四類，另外，若有協同處理器時，會有第五類指令可用。由於本書篇幅的關係，在此不對指令進行詳細介紹，有興趣的讀者請進一步參考 ARM 的相關書籍 。

表格一、ARM 的指令集

| 指令| 說明| 意義| 
|-----|-----|-----|
| MOV {cond}{S} Rd,operand2| 資料傳送| Rd<=operand2| 
| MVN{cond}{S} Rd,operand2| 負資料傳送| Rd<=(~operand2)| 
| ADD{cond}{S} Rd,Rn,operand2| 加法運算| Rd<=Rn+operand2| 
| SUB{cond}{S} Rd,Rn,operand2| 減法運算| Rd<=Rn-operand2| 
| RSB{cond}{S} Rd,Rn,operand2| 逆向減法| Rd<=operand2-Rn| 
| ADC{cond}{S} Rd,Rn,operand2| 帶進位加法| Rd<=Rn+operand2+Carry| 
| SBC{cond}{S} Rd,Rn,operand2| 帶進位減法| Rd<=Rn-operand2-(NOT)Carry| 
| RSC{cond}{S} Rc,Rn,operand2| 帶進位逆向減法| Rd<=operand2-Rn-(NOT)Carry| 
| AND{cond}{S} Rd,Rn,operand2| 邏輯“與”操作| Rd<=Rn&operand2| 
| ORR{cond}{S} Rd,Rn,operand2| 邏輯“或”操作| Rd<=Rn｜operand2| 
| EOR{cond}{S} Rd,Rn,operand2| 邏輯“互斥或”| Rd<=Rn^operand2| 
| BIC{cond}{S} Rd,Rn,operand2| 位元清除| Rd<=Rn&(~operand2)| 
| CMP{cond} Rn,operand2| 比較指令| 標誌 N、Z、C、V<=Rn-operand2| 
| CMN{cond} Rn,operand2| 負數比較指令| 標誌 N、Z、C、V<=Rn+operand2| 
| TST{cond} Rn,operand2| 位元測試指令| 標誌 N、Z、C、V<=Rn&operand2| 
| TEQ{cond} Rn,operand2| 相等測試指令| 標誌 N、Z、C、V<=Rn^operand2| 
||| 記憶體相關指令| 
| LDR{cond} Rd,addressing| 載入 Word| Rd<=[addressing]| 
| LDR{cond}B Rd,addressing| 載入 Byte| Rd<=[addressing]| 
| LDR{cond}T Rd,addressing| 載入Word (以使用者模式)| Rd<=[addressing]| 
| LDR{cond}BT Rd,addressing| 載入Byte  (以使用者模式)| Rd<=[addressing]| 
| LDR{cond}H Rd,addressing| 載入半字組| Rd<=[addressing]| 
| LDR{cond}SB Rd,addressing| 載入 byte (有正負號)| Rd<=[addressing]| 
| LDR{cond}SH Rd,addressing| 載入半字組 (有正負號)| Rd<=[addressing]| 
| STR{cond} Rd,addressing| 儲存Word| [addressing]<=Rd| 
| STRB{cond} Rd,addressing| 儲存Byte| [addressing]<=Rd| 
| STR{cond}T Rd,addressing| 儲存Word (以使用者模式)| [addressing]<=Rd| 
| STR{cond}BT Rd,addressing| 儲存byte (以使用者模式)| [addressing]<=Rd| 
| STR{cond}H Rd,addressing| 儲存半字組| [addressing]<=Rd| 
| LDM{cond}{mode} Rn{!},reglist| 多暫存器載入| reglist<=[Rn…],Rn 寫回| 
| STM{cond}{mode} Rn{!},reglist| 多暫存器儲存| [Rn…]<=reglist, Rn 寫回| 
| SWP{cond} Rd,Rm,Rn	| 暫存器和記憶體字資料交換指令| Rd<=[Rn],[Rn]<=Rm (Rn≠Rd或Rm)| 
| SWP{cond}B Rd,Rm,Rn| 暫存器和記憶體位元組資料交換指令| Rd<=[Rn],[Rn]<=Rm (Rn≠Rd或Rm)| 
| B{cond} label| 分支指令| PC<=label| 
| BL{cond} label| 帶連接的分支| LR<=PC-4,PClabel| 
| BX{cond} label| 帶狀態的分支| PC<=label, 切換處理器狀態| 
| SWI{cond} immed_24| 軟中斷指令| 產生軟中斷，處理器進入管理模式| 
| MRS{cond} Rd,psr| 讀狀態暫存器指令| Rd<=psr,psr為 CPSR 或 SPSR| 
| `MSR{cond} psr_fields,Rd/#immend_8r` | 寫狀態暫存器指令| `psr_fields<=Rd/#immed_8r,p` 為 CPSR 或 SPSR| 
| CDP{cond} coproc,opcode1,CRd,CRn,CRm(,opcode2)| 協同處理器資料操作指令| 取決於協同處理器| 
| LDC{cond}{L} coproc,CRd,<地址>| 協同處理器資料讀取指令| 取決於協同處理器| 
| STC{cond}{L} coproc,CRd,<地址>| 協同處理器資料寫入指令| 取決於協同處理器| 
| MCR{cond} coproc,opcodel,Rd,CRn,CRm{,opcode2}| ARM暫存器到協同處理器暫存器的資料傳送指令| 取決於協同處理器| 
| MRC{cond} coproc,opcodel,Rd,CRn,CRm{,opcode2}| 協同處理器暫存器到ARM暫存器的資料傳送指令| 取決於協同處理器|