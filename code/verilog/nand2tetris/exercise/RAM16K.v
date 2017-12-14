// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/b/RAM16K.hdl

/**
 * Memory of 16K registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then 
 * the in value is loaded into the memory location specified by address 
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM16K {
    IN in[16], load, address[14];
    OUT out[16];

    PARTS:
    DMux4Way(in=true, sel=address[12..13], a=E0, b=E1, c=E2, d=E3);
    
    And(a=load, b=E0, out=L0); RAM4K(in=in,  load=L0, address=address[0..11], out=o0);
    And(a=load, b=E1, out=L1); RAM4K(in=in,  load=L1, address=address[0..11], out=o1);
    And(a=load, b=E2, out=L2); RAM4K(in=in,  load=L2, address=address[0..11], out=o2);
    And(a=load, b=E3, out=L3); RAM4K(in=in,  load=L3, address=address[0..11], out=o3);

    Mux4Way16(a=o0, b=o1, c=o2, d=o3, sel=address[12..13], out=out);
}