// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/02/ALU.hdl

/**
 * The ALU (Arithmetic Logic Unit).
 * Computes one of the following functions:
 * x+y, x-y, y-x, 0, 1, -1, x, y, -x, -y, !x, !y,
 * x+1, y+1, x-1, y-1, x&y, x|y on two 16-bit inputs, 
 * according to 6 input bits denoted zx,nx,zy,ny,f,no.
 * In addition, the ALU computes two 1-bit outputs:
 * if the ALU output == 0, zr is set to 1; otherwise zr is set to 0;
 * if the ALU output < 0, ng is set to 1; otherwise ng is set to 0.
 */

// Implementation: the ALU logic manipulates the x and y inputs
// and operates on the resulting values, as follows:
// if (zx == 1) set x = 0        // 16-bit constant
// if (nx == 1) set x = !x       // bitwise not
// if (zy == 1) set y = 0        // 16-bit constant
// if (ny == 1) set y = !y       // bitwise not
// if (f == 1)  set out = x + y  // integer 2's complement addition
// if (f == 0)  set out = x & y  // bitwise and
// if (no == 1) set out = !out   // bitwise not
// if (out == 0) set zr = 1
// if (out < 0) set ng = 1

CHIP ALU {
    IN  
        x[16], y[16],  // 16-bit inputs        
        zx, // zero the x input?
        nx, // negate the x input?
        zy, // zero the y input?
        ny, // negate the y input?
        f,  // compute out = x + y (if 1) or x & y (if 0)
        no; // negate the out output?

    OUT 
        out[16];

    PARTS:
    Not16(in=x, out=notx);
    And16(a=x,  b=notx, out=z16);         // 
		
    Mux16(a=x,  b=z16,  sel=zx, out=x1);  // if (zx == 1) set x = 0  
    Not16(in=x1,out=notx1);
    Mux16(a=x1, b=notx1, sel=nx, out=x2);  // if (nx == 1) set x = !x
    
    Mux16(a=y,  b=z16,  sel=zy, out=y1);  // if (zy == 1) set y = 0
    Not16(in=y1,out=noty1);
    Mux16(a=y1, b=noty1, sel=ny, out=y2);  // if (ny == 1) set y = !y
    
    Add16(a=x2, b=y2, out=addxy);         // addxy = x + y
    And16(a=x2, b=y2, out=andxy);         // andxy = x & y
    
    Mux16(a=andxy, b=addxy, sel=f, out=o1); // if (f == 1)  set out = x + y else set out = x & y
    Not16(in=o1, out=noto1);
    
    Mux16(a=o1, b=noto1, sel=no, out=out); // if (no == 1) set out = !out
}
