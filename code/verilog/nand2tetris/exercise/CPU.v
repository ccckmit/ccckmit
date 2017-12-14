// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/05/CPU.hdl

/**
 * The Hack CPU (Central Processing unit), consisting of an ALU,
 * two registers named A and D, and a program counter named PC.
 * The CPU is designed to fetch and execute instructions written in 
 * the Hack machine language. In particular, functions as follows:
 * Executes the inputted instruction according to the Hack machine 
 * language specification. The D and A in the language specification
 * refer to CPU-resident registers, while M refers to the external
 * memory location addressed by A, i.e. to Memory[A]. The inM input 
 * holds the value of this location. If the current instruction needs 
 * to write a value to M, the value is placed in outM, the address 
 * of the target location is placed in the addressM output, and the 
 * writeM control bit is asserted. (When writeM==0, any value may 
 * appear in outM). The outM and writeM outputs are combinational: 
 * they are affected instantaneously by the execution of the current 
 * instruction. The addressM and pc outputs are clocked: although they 
 * are affected by the execution of the current instruction, they commit 
 * to their new values only in the next time step. If reset==1 then the 
 * CPU jumps to address 0 (i.e. pc is set to 0 in next time step) rather 
 * than to the address resulting from executing the current instruction. 
 */

 

/*		
		Or(a=zr, b=EQ, out=ZrOrEQ);         // ZrOrEQ = (zr|EQ)
		Not(in=ZrOrEQ, out=nZrEQ);          // notZrEQ = !(zr|EQ)
		Or(a=ngLT, b=zrEQ, out=jLE);        // jLE = (ng&LT) or (zr&EQ)
		Or(a=gGT, b=nZrEQ, out=jGZ);        // jGZ = (g&GT) or !(zr|EQ)
		Or(a=sLE, b=sGZ, out=jPass);        // jPass = (ng&LT) or (zr&EQ) or (g&GT) or !(zr|EQ)
		Or(a=JMP, b=sPass, out=j);          // j = (JMP or ((ng&LT) or (zr&EQ) or (g&GT) or !(zr|EQ))

		Or(a=LT, b=EQ, out=LE); 					  // JL=JLE|JEQ = LT|EQ
		Or(a=GT, b=EQ, out=GE); 					  // JG=JGT|JEQ = GT|EQ
		Or(a=LE, b=GT, out=LGE);
		And(a=LT, b=EQ, out=andLE);
		And(a=andLE, b=GT, out=JMP); 				// JMP = j1&j2&j3
		
//		IRdecoder(ir=instruction, cAluOrI=cAluOrI, Aload=Aload +, Dload=Dload +, cAorM=cAorM+, zx=zx, nx=nx, zy=zy, ny=ny, f=f, no=no);
    And(a=instruction[15], b=instruction[15], out=cAluOrI); // cAluOrI = I[15] 
		// unused : I[14], I[13] 
		And(a=instruction[12], b=instruction[12], out=cAorM);   // cAorM = a = instruction[12]
		And(a=instruction[11], b=instruction[11], out=zx);      // zx = c1 = instruction[11] ?
		And(a=instruction[10], b=instruction[10], out=nx);      // nx = c2 = instruction[10] ?
		And(a=instruction[9], b=instruction[9], out=zy);        // zy = c3 = instruction[9]  ?
		And(a=instruction[8], b=instruction[8], out=ny);        // ny = c4 = instruction[8]  ?
		And(a=instruction[7], b=instruction[7], out=f);         // f  = c5 = instruction[7]  ?
		And(a=instruction[6], b=instruction[6], out=no);        // no = c6 = instruction[6]  ?
		And(a=instruction[5], b=instruction[5], out=Aload);     // Aload = d1 = instruction[5]
		And(a=instruction[4], b=instruction[4], out=Dload);     // Dload = d2 = instruction[4]
		And(a=instruction[3], b=instruction[3], out=Mload);     // Mload = d3 = instruction[3]
		And(a=instruction[2], b=instruction[2], out=LT);        // j1= LT = instruction[2]
		And(a=instruction[1], b=instruction[1], out=EQ);        // j2= EQ = instruction[1]
		And(a=instruction[0], b=instruction[0], out=GT);        // j3= GT = instruction[0]
*/		

// CHIP IRdecoder {
//  IN ir;
//	OUT cAluoOrI, Aload, Dload, cAorM, cALU, zx, nx, zy, ny, f, no;
// }

 
CHIP CPU {

    IN  inM[16],         // M value input  (M = contents of RAM[A])
        instruction[16], // Instruction for execution
        reset;           // Signals whether to re-start the current
                         // program (reset==1) or continue executing
                         // the current program (reset==0).

    OUT outM[16],        // M value output
        writeM,          // Write to M? 
        addressM[15],    // Address in data memory (of M)
        pc[15];          // address of next instruction

    PARTS:
		// JUMP condition
		Or(a=ng, b=zr, out=ngzr);			// ngzr = (ng|zr)
		Not(in=ngzr, out=g);			    // g = out > 0 = !(ng|zr);  ng = out < 0;  zr = out = 0
		And(a=ng, b=instruction[2], out=passLT);          // ngLT = (ng&LT)
		And(a=zr, b=instruction[1], out=passEQ);          // zrEQ = (zr&EQ)
		And(a=g,  b=instruction[0], out=passGT);          // gGT = (g&GT)
		Or(a=passLT, b=passEQ, out=passLE);
		Or(a=passLE, b=passGT, out=pass);

		And(a=instruction[15], b=pass, out=PCload); 			// PCload = I15&J
		
		// ALU
		Mux16(a=Aout, b=inM, sel=instruction[12], out=AorM); // Mux ALU in : cAorM = I[12]
		
    ALU(x=Dout, y=AorM, zx=instruction[11], nx=instruction[10], 
		    zy=instruction[9], ny=instruction[8], f=instruction[7], no=instruction[6], 
				out=ALUout, zr=zr, ng=ng);
		
	  PC(in=Aout, load=PCload, inc=true, reset=reset, out[0..14]=pc);
		
		// A register
		Not(in=instruction[15], out=Ainstruction);
		And(a=instruction[15], b=instruction[5], out=AluToA); // AluToA = I[15]&d1
		Or(a=Ainstruction, b=AluToA, out=Aload);
		
		Mux16(a=instruction, b=ALUout, sel=AluToA, out=Ain); // sel=I[15]
	  ARegister(in=Ain, load=Aload, out=Aout);
		
		// D register
		And(a=instruction[15], b=instruction[4], out=Dload); // Aload = I[15]&d2
	  DRegister(in=ALUout, load=Dload, out=Dout);
		
		// output
		And16(a=Aout, b=Aout, out[0..14]=addressM);
		And(a=instruction[15], b=instruction[3], out=writeM); // writeM = I[15] & d3
		And16(a=ALUout, b=ALUout, out=outM);
}
