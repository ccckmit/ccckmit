// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.
// R0=3
//  @3   // 0
//	D=A  // 1
//	@R0  // 2
//	M=D  // 3
	
// R1=5
//	@5   // 4
//	D=A  // 5
//	@R1  // 6
//	M=D  // 7

// R2 = 0
	@R2    // 8
	M = 0  // 9
	
// a = R0
	@R0    // 10
	D = M  // 11
	@a     // 12
	M = D  // 13
(LOOP)
//   if (a <= 0) goto EXIT
	@a     // 14
	D = M  // 15
	@EXIT  // 16
	D; JLE // 17
	
//   a=a-1;
	@a     // 18
	M = M-1  // 19
// 	R2 = R2 + R1;
	@R1    // 20
	D = M  // 21
	@R2    // 22 
	M = D+M  // 23
// 	goto LOOP
	@LOOP  // 24
  0; JMP // 25
(EXIT)
  @EXIT  // 26
	0; JMP // 27
