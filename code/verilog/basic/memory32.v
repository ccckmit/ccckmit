module memory(input clock, reset, en, rw, 
                input [31:0] abus, input [31:0] dbus_in, output [31:0] dbus_out);
    reg [7:0] m [0:128];
    reg [31:0] data;

    always @(clock or reset or abus or en or rw or dbus_in) 
    begin
        if (reset == 1) begin
            {m[0],m[1],m[2],m[3]}     = 32'h002F000C; // 0000           LD   R2, K0
            {m[4],m[5],m[6],m[7]}     = 32'h001F000C; // 0004           LD   R1, K1
            {m[8],m[9],m[10],m[11]}   = 32'h13221000; // 0008 LOOP:     ADD  R2, R2, R1
            {m[12],m[13],m[14],m[15]} = 32'h26FFFFF8; // 000C           JMP  LOOP
            {m[16],m[17],m[18],m[19]} = 32'h00000000; // 0010 K0:        WORD 0
            {m[20],m[21],m[22],m[23]} = 32'h00000001; // 0014 K1:        WORD 1
            data = 32'hZZZZZZZZ; 
        end else if (abus >=0 && abus < 128) begin
            if (en == 1 && rw == 0) // r_w==0:write
            begin
                data = dbus_in;
                {m[abus], m[abus+1], m[abus+2], m[abus+3]} = dbus_in;
            end
            else if (en == 1 && rw == 1) // r_w==1:read
                data = {m[abus], m[abus+1], m[abus+2], m[abus+3]};
            else
                data = 32'hZZZZZZZZ;
        end else
            data = 32'hZZZZZZZZ;
    end
    assign dbus_out = data;
endmodule

module main;
reg clock, reset, en, rw;
reg [31:0] addr;
reg [31:0] data_in;
wire [31:0] data_out;

memory DUT (.clock(clock), .reset(reset), .en(en), .rw(rw), 
   .abus(addr), .dbus_in(data_in), .dbus_out(data_out));

initial // reset：設定 memory 內容為 0,1,2,....,127
begin
  clock = 0;
  reset = 1;
  en = 0;
  rw = 1; // rw=1:讀取模式
  #75;
  en = 1;
  reset = 0;
  addr = 0;
  #500;
  addr = 4;
  rw = 0; // 寫入模式
  data_in = 8'h3A;
  #100;
  addr = 0;
  rw = 1; // 讀取模式
  data_in = 0;
end

always #50 begin
  clock = clock + 1; 
  $monitor("%4dns monitor: clk=%d en=%d rw=%d, addr=%8h din=%8h dout=%8h", 
           $stime, clock, en, rw, addr, data_in, data_out);  
end

always #200 
begin
 addr=addr+1;
end

initial #2000 $finish;

endmodule
