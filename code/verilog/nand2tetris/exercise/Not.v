module Not(input in, output out);
    nand g(out, in, in);
}

CHIP Or {
    IN a, b;
    OUT out;

    PARTS:
    Not(in=a, out=nota);
    Not(in=b, out=notb);
    Nand(a=nota, b=notb, out=out);    
}


CHIP Xor {
    IN a, b;
    OUT out;

    PARTS:
    Nand (a=a, b=b, out= AnandB);
    Or   (a=a, b=b, out= AorB);
    And  (a=AnandB, b=AorB, out=out);
}

CHIP And {
    IN a, b;
    OUT out;

    PARTS:
    Nand(a=a, b=b, out=AnandB);
    Nand(a=AnandB, b=AnandB, out=out);
}

module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;
xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
or g5(c_out, c2, c1) ;
endmodule

CHIP Add16 {
    IN a[16], b[16];
    OUT out[16];

    PARTS:
    FullAdder(a=a[0], b=b[0], c=false,  sum=out[0], carry=c0);
    FullAdder(a=a[1], b=b[1], c=c0, sum=out[1], carry=c1);
    FullAdder(a=a[2], b=b[2], c=c1, sum=out[2], carry=c2);
    FullAdder(a=a[3], b=b[3], c=c2, sum=out[3], carry=c3);
    FullAdder(a=a[4], b=b[4], c=c3, sum=out[4], carry=c4);
    FullAdder(a=a[5], b=b[5], c=c4, sum=out[5], carry=c5);
    FullAdder(a=a[6], b=b[6], c=c5, sum=out[6], carry=c6);
    FullAdder(a=a[7], b=b[7], c=c6, sum=out[7], carry=c7);
    FullAdder(a=a[8], b=b[8], c=c7, sum=out[8], carry=c8);
    FullAdder(a=a[9], b=b[9], c=c8, sum=out[9], carry=c9);
    FullAdder(a=a[10], b=b[10], c=c9, sum=out[10], carry=c10);    
    FullAdder(a=a[11], b=b[11], c=c10, sum=out[11], carry=c11);   
    FullAdder(a=a[12], b=b[12], c=c11, sum=out[12], carry=c12);   
    FullAdder(a=a[13], b=b[13], c=c12, sum=out[13], carry=c13);   
    FullAdder(a=a[14], b=b[14], c=c13, sum=out[14], carry=c14);   
    FullAdder(a=a[15], b=b[15], c=c14, sum=out[15], carry=c15);
}

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
        out[16], zr, ng;

    PARTS:
    Mux16(a=x,  b=false,  sel=zx, out=x1);    // if (zx == 1) set x = 0  
    Not16(in=x1,out=notx1);
    Mux16(a=x1, b=notx1, sel=nx, out=x2);   // if (nx == 1) set x = !x
    
    Mux16(a=y,  b=false,  sel=zy, out=y1);    // if (zy == 1) set y = 0
    Not16(in=y1,out=noty1);
    Mux16(a=y1, b=noty1, sel=ny, out=y2);   // if (ny == 1) set y = !y
    
    Add16(a=x2, b=y2, out=addxy);           // addxy = x + y
    And16(a=x2, b=y2, out=andxy);           // andxy = x & y
    
    Mux16(a=andxy, b=addxy, sel=f, out=o1); // if (f == 1)  set out = x + y else set out = x & y
    Not16(in=o1, out=noto1);
    
    Mux16(a=o1, b=noto1, sel=no, out=o2);  // if (no == 1) set out = !out
    
    // o2 就是 out, 但必須中間節點才能再次當作輸入，所以先用 o2。
    And16(a=o2, b=o2, out[0..7]=outLow, out[8..15]=outHigh); 
    Or8Way(in=outLow, out=orLow);      // orLow = Or(out[0..7]);
    Or8Way(in=outHigh, out=orHigh);    // orHigh = Or(out[8..15]);
    Or(a=orLow, b=orHigh, out=notzr);  // nzr = Or(out[0..15]);
    Not(in=notzr, out=zr);             // zr = !nzr
    And16(a=o2, b=o2, out[15]=ng);     // ng = out[15]
    And16(a=o2, b=o2, out=out);
}
