// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/RAM8.hdl

/**
 * Memory of 8 registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then 
 * the in value is loaded into the memory location specified by address 
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM8 {
    IN in[16], load, address[3];
    OUT out[16];

    PARTS:
    DMux8Way(in=true, sel=address, a=E0, b=E1, c=E2, d=E3, e=E4, f=E5, g=E6, h=E7);
    
    And(a=load, b=E0, out=L0); Register(in=in, load=L0, out=r0);
    And(a=load, b=E1, out=L1); Register(in=in, load=L1, out=r1);
    And(a=load, b=E2, out=L2); Register(in=in, load=L2, out=r2);
    And(a=load, b=E3, out=L3); Register(in=in, load=L3, out=r3);
    And(a=load, b=E4, out=L4); Register(in=in, load=L4, out=r4);
    And(a=load, b=E5, out=L5); Register(in=in, load=L5, out=r5);
    And(a=load, b=E6, out=L6); Register(in=in, load=L6, out=r6);
    And(a=load, b=E7, out=L7); Register(in=in, load=L7, out=r7);
    
    Mux8Way16(a=r0, b=r1, c=r2, d=r3, e=r4, f=r5, g=r6, h=r7, sel=address, out=out);
}