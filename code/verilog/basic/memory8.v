module memory(input clock, reset, en, r_w, input [7:0] abus, input [7:0] dbus_in, output [7:0] dbus_out);
reg [7:0] m [0:128];
reg [7:0] data;
reg [7:0] i;

    always @(posedge clock) 
    begin
        if (reset == 1)
        begin
            m[0] <= 8'h00;
            m[1] <= 8'h01;
            m[2] <= 8'h02;
            m[3] <= 8'h03;
            m[4] <= 8'h04;
            data = 8'h00;
        end
        else if (en == 1 && r_w == 0) // r_w==0:write
        begin
            data = dbus_in;
            m[abus] = dbus_in;
        end
        else if (en == 1 && r_w == 1) // r_w==1:read
            data = m[abus];
        else
            data = 8'hZZ;
    end
    assign dbus_out = data;
endmodule

module main;
reg clock, reset, en, r_w;
reg [7:0] addr;
reg [7:0] data_in;
wire [7:0] dbus_out;

memory DUT (.clock(clock), .reset(reset), .en(en), .r_w(r_w), .abus(addr), .dbus_in(data_in), .dbus_out(dbus_out));

initial // reset：設定 memory 內容為 0,1,2,....,127
begin
  clock = 0;
  reset = 1;
  en = 0;
  r_w = 1; // r_w=1:讀取模式
  #75;
  en = 1;
  reset = 0;
  addr = 0;
  #500;
  addr = 1;
  r_w = 0; // 寫入模式
  data_in = 8'h3A;
  #100;
  addr = 0;
  r_w = 1; // 讀取模式
  data_in = 0;
end

always #50 clock = clock + 1; 

always #200 
begin
 addr=addr+1;
end

endmodule
