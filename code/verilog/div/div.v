// 來源: http://blog.csdn.net/rill_zhen/article/details/7961937

/*  
* module:div_rill  
* file name:div_rill.v  
* syn:yes  
* author:network  
* modify:rill  
* date:2012-09-07  
*/  
  
module div_rill  
(  
input[31:0] a,   
input[31:0] b,  
  
output reg [31:0] yshang,  
output reg [31:0] yyushu  
);  
  
reg[31:0] tempa;  
reg[31:0] tempb;  
reg[63:0] temp_a;  
reg[63:0] temp_b;  
  
integer i;  
  
always @(a or b)  
begin  
    tempa <= a;  
    tempb <= b;  
end  
  
always @(tempa or tempb)  
begin  
    temp_a = {32'h00000000,tempa};  
    temp_b = {tempb,32'h00000000};   
    for(i = 0;i < 32;i = i + 1)  
        begin  
            temp_a = {temp_a[62:0],1'b0};  
            if(temp_a[63:32] >= tempb)  
                temp_a = temp_a - temp_b + 1'b1;  
            else  
                temp_a = temp_a;  
        end  
  
    yshang <= temp_a[31:0];  
    yyushu <= temp_a[63:32];  
end  
  
endmodule  
  
/*************** EOF ******************/  

/*  
* module:div_rill_tb  
* file name:div_rill_tb.v  
* syn:no  
* author:rill  
* date:2012-09-07  
*/  
  
  
`timescale 1ns/1ns  
  
module div_rill_tb;  
  
reg [31:0] a;  
reg [31:0] b;  
wire [31:0] yshang;  
wire [31:0] yyushu;  
  
initial  
begin  
    #10 a = $random()%10000;  
        b = $random()%1000;  
          
    #100 a = $random()%1000;  
        b = $random()%100;  
          
    #100 a = $random()%100;  
        b = $random()%10;     
          
    #1000 $stop;  
end  
  
div_rill DIV_RILL  
(  
.a (a),  
.b (b),  
  
.yshang (yshang),  
.yyushu (yyushu)  
);  
  
endmodule  
/******** EOF ******************/  

