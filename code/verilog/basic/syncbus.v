module master(input clock, w, output [15:0] address, inout [15:0] data);
  reg [15:0] ar, dr;
  assign address = ar;
  assign data = (w)?dr : 16'hzzzz;

  always @(*) begin
    if (!w)
	  dr=#1 data;
  end  
endmodule

module rdevice(input clock, w, input [15:0] address, output [15:0] data);
  reg [15:0] dr;

  assign data=(!w)?dr:16'hZZZZ;
  
  always @(clock or w or address) begin
    if (!w && address == 16'hFFF0)
	  dr = #1 16'he3e3;
  end
endmodule

module wdevice(input clock, w, input [15:0] address, input [15:0] data);
  reg [15:0] dr;
  
  always @(clock or w or address) begin
    if (w && address == 16'hFFF8)
	  dr = #1 data;
  end
endmodule

module main;
reg clock, w;
wire [15:0] abus, dbus;

master  m(clock, w, abus, dbus);
rdevice rd(clock, w, abus, dbus);
wdevice wd(clock, w, abus, dbus);
initial begin
  $monitor("%4dns abus=%x dbus=%x w=%x m.ar=%x m.dr=%x rd.dr=%x wd.dr=%x", $stime, abus, dbus, w, m.ar, m.dr, rd.dr, wd.dr);
  $dumpfile("syncbus.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;    
  clock = 0;
  #10; m.ar=16'h0000; w=0; 
  #50; m.ar=16'hFFF0; 
  #50; m.ar=16'hFFF8; m.dr=16'h71F0; w=1;
  #300; $finish;
end

always #5 clock=~clock; // 每隔 5ns 反相，時脈週期為 10ns
endmodule
