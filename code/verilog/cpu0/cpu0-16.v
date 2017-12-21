module cpu(input clock, reset, 
         output [0:7] segPc1, output [0:7] segPc0, 
         output [0:7] segTick,
         output [0:7] segAlu1, output [0:7] segAlu0,
			
			  input CLOCK_50, // 50 MHz clock

  //LCD Module 16X2
  output LCD_ON, // LCD Power ON/OFF
  output LCD_BLON, // LCD Back Light ON/OFF
  output LCD_RW, // LCD Read/Write Select, 0 = Write, 1 = Read
  output LCD_EN, // LCD Enable
  output LCD_RS, // LCD Command/Data Select, 0 = Command, 1 = Data
  inout [7:0] LCD_DATA, // LCD Data bus 8 bits
  
  //  PS2 data and clock lines  
  input PS2_DAT,
  input PS2_CLK
			);
wire [3:0] tick;
wire [15:0] pc, ir, mar, mdr, dbus;
wire [31:0] counter;
wire [15:0] aluOut;
wire m_en, m_rw;

Counter mCounter(clock, counter);

cpu0m cpu (.clock(counter[24]), .reset(reset), .pc(pc), .tick(tick), .ir(ir), 
.mar(mar), .mdr(mdr), .dbus(dbus), .m_en(m_en), .m_rw(m_rw), .aluOut(aluOut));

memory0m mem (.clock(counter[24]), .reset(reset), .en(m_en), .rw(m_rw), 
.abus(mar), .dbus_in(mdr), .dbus_out(dbus));

io io1 (.clock(counter[24]), .en(m_en), .rw(m_rw), 
.abus(mar), .dbus_in(mdr), .dbus_out(dbus), .scan_code(scan_code), .lcd_char(lcd_char));

Seg7 mSegPc1(pc[7:4], segPc1);
Seg7 mSegPc0(pc[3:0], segPc0);
Seg7 mSegTick(tick, segTick);

Seg7 mSegAlu1(aluOut[7:4], segAlu1);
Seg7 mSegAlu0(aluOut[3:0], segAlu0);

// reset delay gives some time for peripherals to initialize
wire DLY_RST;
Reset_Delay r0( .iCLK(CLOCK_50),.oRESET(DLY_RST) );

// turn LCD ON
assign LCD_ON  = 1'b1;
assign LCD_BLON = 1'b1;

wire reset_lcd = 1'b0;
wire [7:0] scan_code;
wire [7:0] lcd_char;
wire read, scan_ready;


oneshot pulser(
   .pulse_out(read),
   .trigger_in(scan_ready),
   .clk(CLOCK_50)
);

keyboard kbd(
  .keyboard_clk(PS2_CLK),
  .keyboard_data(PS2_DAT),
  .clock50(CLOCK_50),
  .reset_lcd(reset_lcd),
  .read(read),
  .scan_ready(scan_ready),
  .scan_code(scan_code)
);


LCD_Display u1(
// Host Side
   .iCLK_50MHZ(CLOCK_50),
   .iRST_N(DLY_RST),
   .hex0(lcd_char),   //Display Scan_Code
// LCD Side
   .DATA_BUS(LCD_DATA),
   .LCD_RW(LCD_RW),
   .LCD_E(LCD_EN),
   .LCD_RS(LCD_RS)
);

endmodule


module cpu0m(input clock, reset, output reg [15:0] pc, 
             output reg [2:0] tick, output reg [15:0] ir,
                 output reg [15:0] mar, output reg [15:0] mdr,
                 inout [15:0] dbus, output reg m_en, m_rw,
                      output reg signed [15:0] aluOut);
	 reg [4:0] op;
	 reg [10:0] rb;
    reg signed [10:0] cx11;
	 reg signed [15:0] addr16, B;
    reg signed [15:0] R [0:15];

    `define PC  R[15]
	`define SW  R[12]   // 狀態暫存器
	
	`define N   `SW[15] // 負號旗標
    `define Z   `SW[14] // 零旗標
	
	parameter [7:0] LD=5'b00000, ST=5'b00001, CMP=5'b00010, MOV=5'b00011, ADD=5'b00100, 
						 SUB=5'b00101, MUL=5'b00110, DIV=5'b00111,AND=5'b01000, OR=5'b01001, 
						 XOR=5'b01010, JEQ=5'b01011, JNE=5'b01100, JLT=5'b01101, JGT=5'b01110, 
						 JMP=5'b01111;	

   always @(posedge clock) begin
        if (reset) begin
            `PC = 0;
				`SW = 0;
            tick = 0;
				aluOut = 0;
				end
        else begin
            tick = tick+1;
            m_en = 0;
            case (tick)
            // 指令擷取階段 Tick 1..3 ： memory.read(m[PC])
                1:    begin  // Tick 1：將 PC 丟到位址匯流排上
                    mar = `PC; // MAR = PC
                    m_rw = 1; // m_rw=1 is read mode, read(m[MAR]) => read(m[PC])
                    m_en = 1;
                    `PC = `PC+2; // PC = PC + 2
                end
                2:    begin  // Tick 2：ir = m[PC]
                    mdr = dbus;
                    ir = mdr; // IR = dbus = m[PC]
                    {op,rb} = ir;
                    cx11 = ir[10:0];
                end
                3:    begin  // Tick 3：取出暫存器 R[ra], R[rb] 內容
                    m_en = 0;
                    B = R[rb];
                end
            // 指令執行階段 Tick 4..6 ： execute(IR)
                4:    begin  // Tick 4：將 PC 丟到位址匯流排上
                    case (op) // 解讀 OP: Tick 4
                        LD: begin   // 指令：LD cx ; 語意：R[2] = m[cx]
                            mar = cx11; // mar = 讀取位址 = cx
                            m_rw = 1; // 讀取模式：read
                            m_en = 1;
                        end
								ST: begin // 指令：ST cx ; 語意：m[cx]=R[2]
                            mar = cx11;  // 寫入位址 = cx
                            mdr = R[2]; // 寫入資料：R[2]
                            m_rw = 0; // 寫入模式：write
                            m_en = 1;
                        end
								MOV: begin // 指令：MOV r1, rb ; 語意：R[1]=R[rb]
                            R[1] = B;
                        end
                        ADD: begin // 指令：ADD r1, r1, r2 ; 語意：R[1]=R[1]+R[2] 
                            aluOut = aluOut + B; // 執行加法
                        end
								JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            addr16 = cx11; // 取出 cx 並轉為 16 位元有號
                            `PC = `PC+addr16; // 跳躍目標位址=PC+cx
                        end
                        default:    begin
                        end
                    endcase
                end
                5:    begin // 解讀 OP: Tick 5
                    case (op) // LD cx ; R[2] = m[cx] ;
                        LD: begin // 指令：LD cx ; 語意：R[2] = m[cx]
                            mdr = dbus; // 取得記憶體傳回的 dbus = m[cx]
                            R[2] = mdr; // 存入到目標暫存器 R[2] 中 
                            R[1] = 0;
                            m_en = 0; // 讀取完畢
                        end
								ST: begin 
                            m_en = 0; // 寫入完畢
                        end
                        ADD: begin 
                            R[1] = aluOut;
                        end
                        default:    begin
                        end
                    endcase
                end                
                6:    begin
                    tick = 0;
                end
                default:    begin
                end
            endcase
        end
        pc = `PC;
    end
endmodule


module Seg7(input [3:0] num, output [0:7] seg);
   reg [7:0] nseg;
    always @(num) begin
        case (num)
            4'b0000: nseg = 8'b11111100; // 0
            4'b0001: nseg = 8'b01100000; // 1
            4'b0010: nseg = 8'b11011010; // 2
            4'b0011: nseg = 8'b11110010; // 3
            4'b0100: nseg = 8'b01100110; // 4
            4'b0101: nseg = 8'b10110110; // 5
            4'b0110: nseg = 8'b10111110; // 6
            4'b0111: nseg = 8'b11100100; // 7
            4'b1000: nseg = 8'b11111110; // 8
            4'b1001: nseg = 8'b11110110; // 9
            4'b1010: nseg = 8'b11101110; // A
            4'b1011: nseg = 8'b00111110; // b
            4'b1100: nseg = 8'b10011100; // C
            4'b1101: nseg = 8'b01111010; // d
            4'b1110: nseg = 8'b10011110; // E
            4'b1111: nseg = 8'b10001110; // F
            default: nseg = 8'b00000000; //  
        endcase
    end
   assign seg = ~nseg;
endmodule


module Counter(input clock, output reg [31:0] counter);
always @(posedge clock) begin
    counter = counter + 1;
end
endmodule


module io(input clock, en, rw, 
            input [15:0] abus, input [15:0] dbus_in, output reg [15:0] dbus_out,
				input [7:0] scan_code, output reg [7:0] lcd_char);
reg [7:0] key;
	 	 
	     always @(clock or abus or en or rw or dbus_in) 
    begin
		if (en == 1 && rw == 1) begin // Keyboard   r_w==1:read
			key = scan_code;		  // 鍵盤打了字元，存到 key 裡面		
		end else
			    dbus_out = 16'hZZZZ;
        if (abus==130) begin  
            if (en == 1 && rw == 1) // r_w==1:read
				dbus_out = key;     // key傳給資料匯流排
		end
		 if (abus==132) begin
            if (en == 1 && rw == 0) // r_w==0:write
					lcd_char = dbus_in; //匯流排寫入lcd_char
			if (en == 1 && rw == 1) // r_w==1:read
				dbus_out = lcd_char; //lcd_char傳給匯流排  
		end		
    end
endmodule


module memory0m(input clock, reset, en, rw, 
            input [15:0] abus, input [15:0] dbus_in, output [15:0] dbus_out);
reg [7:0] m [0:134];
reg [15:0] data;

    always @(clock or reset or abus or en or rw or dbus_in) 
    begin
        if (reset == 1) begin		  
		  	{m[0],m[1]}= 16'b0000000010000010; // 0000 F1: LD R2, m[130]      
			{m[2],m[3]}= 16'b0000100010000100; // 0002     ST R2, m[132]      
			{m[4],m[5]}= 16'b0000000010000100; // 0004     LD R2, m[132]      
			{m[6],m[7]}= 16'b0010000000000010; // 0006     ADD R1, R1, R2 
			{m[8],m[9]}= 16'b0111111111110110; // 0008     JMP F1	  
            data = 16'hZZZZ; 
        end else if (abus >=0 && abus < 128) begin
            if (en == 1 && rw == 0) // r_w==0:write
            begin
                data = dbus_in;
                {m[abus], m[abus+1]} = dbus_in;
            end
            else if (en == 1 && rw == 1) // r_w==1:read
                data = {m[abus], m[abus+1]};
            else
                data = 16'hZZZZ;
        end else
            data = 16'hZZZZ;
    end
    assign dbus_out = data;
endmodule


module oneshot(output reg pulse_out, input trigger_in, input clk);
reg delay;

always @ (posedge clk)
begin
 if (trigger_in && !delay) pulse_out <= 1'b1;
 else pulse_out <= 1'b0;
 delay <= trigger_in;
end 
endmodule


module Reset_Delay(iCLK,oRESET);
input  iCLK;
output reg oRESET;
reg [19:0] Cont;

always@(posedge iCLK)
begin
 if(Cont!=20'hFFFFF)
 begin
  Cont <= Cont+1'b1;
  oRESET <= 1'b0;
 end
 else
 oRESET <= 1'b1;
end

endmodule


module keyboard(keyboard_clk, keyboard_data, clock50, reset_lcd, read, scan_ready, scan_code);
input keyboard_clk;
input keyboard_data;
input clock50; // 50 Mhz system clock
input reset_lcd;
input read;
output scan_ready;
output [7:0] scan_code;
reg ready_set;
reg [7:0] scan_code;
reg scan_ready;
reg read_char;
reg clock; // 25 Mhz internal clock

reg [3:0] incnt;
reg [8:0] shiftin;

reg [7:0] filter;
reg keyboard_clk_filtered;

// scan_ready is set to 1 when scan_code is available.
// user should set read to 1 and then to 0 to clear scan_ready

always @ (posedge ready_set or posedge read)
if (read == 1) scan_ready <= 0;
else scan_ready <= 1;

// divide-by-two 50MHz to 25MHz
always @(posedge clock50)
 clock <= ~clock;

// This process filters the raw clock signal coming from the keyboard 
// using an eight-bit shift register and two AND gates

always @(posedge clock)
begin
   filter <= {keyboard_clk, filter[7:1]};
   if (filter==8'b1111_1111) keyboard_clk_filtered <= 1;
   else if (filter==8'b0000_0000) keyboard_clk_filtered <= 0;
end


// This process reads in serial data coming from the terminal

always @(posedge keyboard_clk_filtered)
begin
   if (reset_lcd==1)
   begin
      incnt <= 4'b0000;
      read_char <= 0;
   end
   else if (keyboard_data==0 && read_char==0)
   begin
 read_char <= 1;
 ready_set <= 0;
   end
   else
   begin
    // shift in next 8 data bits to assemble a scan code 
    if (read_char == 1)
     begin
        if (incnt < 9) 
        begin
    incnt <= incnt + 1'b1;
    shiftin = { keyboard_data, shiftin[8:1]};
    ready_set <= 0;
   end
  else
   begin
    incnt <= 0;
    scan_code <= shiftin[7:0];
    read_char <= 0;
    ready_set <= 1;
   end
  end
 end
end

endmodule


/*
ENTITY LCD_Display IS
-- Enter number of live Hex hardware data values to display
-- (do not count ASCII character constants)
 GENERIC(Num_Hex_Digits: Integer:= 2); 
-----------------------------------------------------------------------
-- LCD Displays 16 Characters on 2 lines
------------------------------------------------------------------- 
--                        ASCII HEX TABLE
--  Hex      Low Hex Digit
-- Value  0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F
------\----------------------------------------------------------------
--H  2 |  SP  !   "   #   $   %   &   '   (   )   *   +   ,   -   .   /
--i  3 |  0   1   2   3   4   5   6   7   8   9   :   ;   <   =   >   ?
--g  4 |  @   A   B   C   D   E   F   G   H   I   J   K   L   M   N   O
--h  5 |  P   Q   R   S   T   U   V   W   X   Y   Z   [   \   ]   ^   _
--   6 |  `   a   b   c   d   e   f   g   h   i   j   k   l   m   n   o
--   7 |  p   q   r   s   t   u   v   w   x   y   z   {   |   }   ~ DEL
-----------------------------------------------------------------------

*/
  
  
module LCD_Display(iCLK_50MHZ, iRST_N, hex0, 
 LCD_RS,LCD_E,LCD_RW,DATA_BUS);
input iCLK_50MHZ, iRST_N;
input [7:0]  hex0;
output LCD_RS, LCD_E, LCD_RW;
inout [7:0] DATA_BUS;

parameter
HOLD = 4'h0,
FUNC_SET = 4'h1,
DISPLAY_ON = 4'h2,
MODE_SET = 4'h3,
Print_String = 4'h4,
LINE2 = 4'h5,
RETURN_HOME = 4'h6,
DROP_LCD_E = 4'h7,
reset_lcd1 = 4'h8,
reset_lcd2 = 4'h9,
reset_lcd3 = 4'ha,
DISPLAY_OFF = 4'hb,
DISPLAY_CLEAR = 4'hc;

reg [3:0] state, next_command;
// Enter new ASCII hex data above for LCD Display
reg [7:0] DATA_BUS_VALUE;
wire [7:0] Next_Char;
reg [19:0] CLK_COUNT_400HZ;
reg [4:0] CHAR_COUNT;
reg CLK_400HZ, LCD_RW_INT, LCD_E, LCD_RS;

// BIDIRECTIONAL TRI STATE LCD DATA BUS
assign DATA_BUS = (LCD_RW_INT? 8'bZZZZZZZZ: DATA_BUS_VALUE);

LCD_display_string u1(
.index(CHAR_COUNT),
.out(Next_Char),
.hex0(hex0));

assign LCD_RW = LCD_RW_INT;

always @(posedge iCLK_50MHZ or negedge iRST_N)
 if (!iRST_N)
 begin
    CLK_COUNT_400HZ <= 20'h00000;
    CLK_400HZ <= 1'b0;
 end
 else if (CLK_COUNT_400HZ < 20'h0F424)
 begin
    CLK_COUNT_400HZ <= CLK_COUNT_400HZ + 1'b1;
 end
 else
 begin
   CLK_COUNT_400HZ <= 20'h00000;
   CLK_400HZ <= ~CLK_400HZ;
 end
// State Machine to send commands and data to LCD DISPLAY

always @(posedge CLK_400HZ or negedge iRST_N)
 if (!iRST_N)
 begin
  state <= reset_lcd1;
 end
 else
 case (state)
 reset_lcd1:   
// Set Function to 8-bit transfer and 2 line display with 5x8 Font size
// see Hitachi HD44780 family data sheet for LCD command and timing details
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h38;
   state <= DROP_LCD_E;
   next_command <= reset_lcd2;
   CHAR_COUNT <= 5'b00000;
 end
 reset_lcd2:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h38;
   state <= DROP_LCD_E;
   next_command <= reset_lcd3;
 end
 reset_lcd3:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h38;
   state <= DROP_LCD_E;
   next_command <= FUNC_SET;
 end
// EXTRA STATES ABOVE ARE NEEDED FOR RELIABLE PUSHBUTTON reset_lcd OF LCD

  FUNC_SET:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h38;
   state <= DROP_LCD_E;
   next_command <= DISPLAY_OFF;
 end

// Turn off Display and Turn off cursor
 DISPLAY_OFF:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h08;
   state <= DROP_LCD_E;
   next_command <= DISPLAY_CLEAR;
 end

// Clear Display and Turn off cursor
 DISPLAY_CLEAR:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h01;
   state <= DROP_LCD_E;
   next_command <= DISPLAY_ON;
 end

// Turn on Display and Turn off cursor
 DISPLAY_ON:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h0C;
   state <= DROP_LCD_E;
   next_command <= MODE_SET;
 end

// Set write mode to auto increment address and move cursor to the right
 MODE_SET:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h06;
   state <= DROP_LCD_E;
   next_command <= Print_String;
 end

// Write ASCII hex character in first LCD character location
 Print_String:
 begin
   state <= DROP_LCD_E;
   LCD_E <= 1'b1;
   LCD_RS <= 1'b1;
   LCD_RW_INT <= 1'b0;
 // ASCII character to output
   if (Next_Char[7:4] != 4'h0)
  DATA_BUS_VALUE <= Next_Char;
  // Convert 4-bit value to an ASCII hex digit
   else if (Next_Char[3:0] >9)
  // ASCII A...F
   DATA_BUS_VALUE <= {4'h4,Next_Char[3:0]-4'h9};
   else
  // ASCII 0...9
   DATA_BUS_VALUE <= {4'h3,Next_Char[3:0]};
 // Loop to send out 32 characters to LCD Display  (16 by 2 lines)
   if ((CHAR_COUNT < 31) && (Next_Char != 8'hFE))
      CHAR_COUNT <= CHAR_COUNT + 1'b1;
   else
      CHAR_COUNT <= 5'b00000; 
 // Jump to second line?
   if (CHAR_COUNT == 15)
     next_command <= LINE2;
 // Return to first line?
   else if ((CHAR_COUNT == 31) || (Next_Char == 8'hFE))
     next_command <= RETURN_HOME;
   else
     next_command <= Print_String;
 end

// Set write address to line 2 character 1
 LINE2:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'hC0;
   state <= DROP_LCD_E;
   next_command <= Print_String;
 end

// Return write address to first character postion on line 1
 RETURN_HOME:
 begin
   LCD_E <= 1'b1;
   LCD_RS <= 1'b0;
   LCD_RW_INT <= 1'b0;
   DATA_BUS_VALUE <= 8'h80;
   state <= DROP_LCD_E;
   next_command <= Print_String;
 end

// The next three states occur at the end of each command or data transfer to the LCD
// Drop LCD E line - falling edge loads inst/data to LCD controller
 DROP_LCD_E:
 begin
   LCD_E <= 1'b0;
   state <= HOLD;
 end
// Hold LCD inst/data valid after falling edge of E line    
 HOLD:
 begin
   state <= next_command;
 end
 endcase
endmodule


module LCD_display_string(index,out,hex0);
input [4:0] index;
input [7:0] hex0;
output [7:0] out;
reg [7:0] out;



// ASCII hex values for LCD Display
// Enter Live Hex Data Values from hardware here
// LCD DISPLAYS THE FOLLOWING:
//----------------------------
//| Count=XX                  |
//| DE2                       |
//----------------------------
// Line 1
   always
     case (index)
 5'h00: out <= 8'h50; //P
 5'h01: out <= 8'h53; //S
 5'h02: out <= 8'h32; //2
 5'h03: out <= 8'h20; //
 5'h04: out <= 8'h53; //S
 5'h05: out <= 8'h63; //c
 5'h06: out <= 8'h61; //a
 5'h07: out <= 8'h6e; //n
 5'h08: out <= 8'h43; //C
 5'h09: out <= 8'h6f; //o
 5'h0a: out <= 8'h64; //d
 5'h0b: out <= 8'h65; //e
 5'h0c: out <= 8'h3D; //=
 5'h0d: out <= ASCII(hex0);
// Line 2
 5'h10: out <= 8'h44; //D
 5'h11: out <= 8'h45; //E
 5'h12: out <= 8'h32; //2
 5'h13: out <= 8'h5f; // 
 5'h14: out <= 8'h37; //7
 5'h15: out <= 8'h30; //0
 5'h16: out <= 8'h20; //
 5'h17: out <= 8'h50; //P
 5'h18: out <= 8'h53; //S
 5'h19: out <= 8'h32; //2
 5'h1a: out <= 8'h2b; //+
 5'h1b: out <= 8'h4c; //L
 5'h1c: out <= 8'h43; //C
 5'h1d: out <= 8'h44; //D

  default: out <= 8'h20;
     endcase
	  function [7:0] ASCII;
	   input [7:0] data;
		case(data)
		/*A-Z*/
		8'h1c:ASCII=8'h41;
		8'h32:ASCII=8'h42;
		8'h21:ASCII=8'h43;
		8'h23:ASCII=8'h44;
		8'h24:ASCII=8'h45;
		8'h2B:ASCII=8'h46;
		8'h34:ASCII=8'h47;
		8'h33:ASCII=8'h48;
		8'h43:ASCII=8'h49;
		8'h3B:ASCII=8'h4A;
		8'h42:ASCII=8'h4B;
		8'h4B:ASCII=8'h4C;
		8'h3A:ASCII=8'h4D;
		8'h31:ASCII=8'h4E;
		8'h44:ASCII=8'h4F;
		8'h4D:ASCII=8'h50;
		8'h15:ASCII=8'h51;
		8'h2D:ASCII=8'h52;
		8'h1B:ASCII=8'h53;
		8'h2C:ASCII=8'h54;
		8'h3C:ASCII=8'h55;
		8'h2A:ASCII=8'h56;
		8'h1D:ASCII=8'h57;
		8'h22:ASCII=8'h58;
		8'h35:ASCII=8'h59;
		8'h1A:ASCII=8'h5A;
		/*0-9 top*/
		8'h45:ASCII=8'h30;
		8'h16:ASCII=8'h31;
		8'h1E:ASCII=8'h32;
		8'h26:ASCII=8'h33;
		8'h25:ASCII=8'h34;
		8'h2E:ASCII=8'h35;
		8'h36:ASCII=8'h36;
		8'h3D:ASCII=8'h37;
		8'h3E:ASCII=8'h38;
		8'h46:ASCII=8'h39;
		/*0-9 right*/
		8'h70:ASCII=8'h30;
		8'h69:ASCII=8'h31;
		8'h72:ASCII=8'h32;
		8'h7A:ASCII=8'h33;
		8'h6B:ASCII=8'h34;
		8'h73:ASCII=8'h35;
		8'h74:ASCII=8'h36;
		8'h6C:ASCII=8'h37;
		8'h75:ASCII=8'h38;
		8'h7D:ASCII=8'h39;
		default:begin
			ASCII=8'h00;
		end
		endcase
	endfunction	 
endmodule
