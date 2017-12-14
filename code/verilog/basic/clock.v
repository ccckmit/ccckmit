module main;
reg clock;

initial begin
  $monitor("%4dns clock=%x", $stime, clock);
  clock = 0;
  #300; $finish;
end

always #5 clock=~clock; // 每隔 5ns 反相，時脈週期為 10ns
endmodule
