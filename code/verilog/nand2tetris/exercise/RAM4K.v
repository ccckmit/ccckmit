// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/b/RAM4K.hdl

/**
 * Memory of 4K registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then 
 * the in value is loaded into the memory location specified by address 
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM4K {
    IN in[16], load, address[12];
    OUT out[16];

    PARTS:
    DMux8Way(in=true, sel=address[9..11], a=E0, b=E1, c=E2, d=E3, e=E4, f=E5, g=E6, h=E7);
    
    And(a=load, b=E0, out=L0); RAM512(in=in,  load=L0, address=address[0..8], out=o0);
    And(a=load, b=E1, out=L1); RAM512(in=in,  load=L1, address=address[0..8], out=o1);
    And(a=load, b=E2, out=L2); RAM512(in=in,  load=L2, address=address[0..8], out=o2);
    And(a=load, b=E3, out=L3); RAM512(in=in,  load=L3, address=address[0..8], out=o3);
    And(a=load, b=E4, out=L4); RAM512(in=in,  load=L4, address=address[0..8], out=o4);
    And(a=load, b=E5, out=L5); RAM512(in=in,  load=L5, address=address[0..8], out=o5);
    And(a=load, b=E6, out=L6); RAM512(in=in,  load=L6, address=address[0..8], out=o6);
    And(a=load, b=E7, out=L7); RAM512(in=in,  load=L7, address=address[0..8], out=o7);

    Mux8Way16(a=o0, b=o1, c=o2, d=o3, e=o4, f=o5, g=o6, h=o7, sel=address[9..11], out=out);
}