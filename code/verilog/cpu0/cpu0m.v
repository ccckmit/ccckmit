`define PC R[15] // 程式計數器 PC 其實是 R[15] 的別名

module cpu0m(input clock); // CPU0-Mini 的快取版：cpu0mc 模組
  parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26; // 支援 4 個指令
  reg signed [31:0] R [0:15];   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg signed [31:0] IR;         // 指令暫存器 IR
  reg [7:0] m [0:128];          // 內部的快取記憶體
  reg [7:0] op;                 // 變數：運算代碼 op
  reg [3:0] ra, rb, rc;         // 變數：暫存器代號 ra, rb, rc
  reg signed [11:0] cx12;       // 變數：12 位元常數 cx12
  reg signed [15:0] cx16;       // 變數：16 位元常數 cx16
  reg signed [23:0] cx24;       // 變數：24 位元常數 cx24
  reg signed [31:0] addr;       // 變數：暫存記憶體位址

  initial  // 初始化
  begin
    `PC = 0;                    // 將 PC 設為起動位址 0
    R[0] = 0;                   // 將 R[0] 暫存器強制設定為 0
    {m[0],m[1],m[2],m[3]}    = 32'h001F0018; // 0000       LD   R1, K1
    {m[4],m[5],m[6],m[7]}    = 32'h002F0010; // 0004       LD   R2, K0
    {m[8],m[9],m[10],m[11]}  = 32'h003F0014; // 0008       LD   R3, SUM
    {m[12],m[13],m[14],m[15]}= 32'h13221000; // 000C LOOP: ADD  R2, R2, R1
    {m[16],m[17],m[18],m[19]}= 32'h13332000; // 0010       ADD  R3, R3, R2
    {m[20],m[21],m[22],m[23]}= 32'h26FFFFF4; // 0014       JMP  LOOP
    {m[24],m[25],m[26],m[27]}= 32'h00000000; // 0018 K0:   WORD 0
    {m[28],m[29],m[30],m[31]}= 32'h00000001; // 001C K1:   WORD 1
    {m[32],m[33],m[34],m[35]}= 32'h00000000; // 0020 SUM:  WORD 0
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
      IR = {m[`PC], m[`PC+1], m[`PC+2], m[`PC+3]};  // 指令擷取階段：IR=m[PC], 4 個 Byte 的記憶體
      `PC = `PC+4;                                  // 擷取完成，PC 前進到下一個指令位址
      {op,ra,rb,rc,cx12} = IR;                      // 解碼階段：將 IR 解為 {op, ra, rb, rc, cx12}
      cx24 = IR[23:0];                              //           解出 IR[23:0] 放入 cx24
      cx16 = IR[15:0];                              //           解出 IR[15:0] 放入 cx16
      addr = R[rb]+cx16;                              // 記憶體存取位址 = PC+cx16
      case (op) // 根據 OP 執行對應的動作
        LD: begin   // 載入指令： R[ra] = m[addr]
          R[ra] = {m[addr], m[addr+1], m[addr+2], m[addr+3]};
          $write("%4dns %8x : LD  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
          end
        ST: begin   // 儲存指令： m[addr] = R[ra]
          {m[addr], m[addr+1], m[addr+2], m[addr+3]} = R[ra];
          $write("%4dns %8x : ST  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
          end
        ADD: begin  // 加法指令： R[ra] = R[rb]+R[rc]
          R[ra] = R[rb]+R[rc];
          $write("%4dns %8x : ADD %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        JMP:begin   // 跳躍指令： PC = PC + cx24
          addr = cx24; // 取出 cx 並轉為 32 位元有號數
          `PC = `PC + addr; // 跳躍目標位址=PC+cx
          $write("%4dns %8x : JMP %-8x", $stime, `PC, cx24);
          end
      endcase
      $display(" R[%2d]=%4d", ra, R[ra]); // 顯示目標暫存器的值
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu0m cpu(clock);          // 宣告 cpu0mc 處理器

initial clock = 0;          // 一開始 clock 設定為 0
always #10 clock=~clock;    // 每隔 10 奈秒將 clock 反相，產生週期為 20 奈秒的時脈
initial #640 $finish;       // 在 640 奈秒的時候停止測試。(因為這時的 R[1] 恰好是 1+2+...+10=55 的結果)
endmodule
