// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/01/Mux.hdl

/** 
 * Multiplexor:
 * out = a if sel == 0
 *       b otherwise
 */

CHIP Mux {
    IN a, b, sel;
    OUT out;

    PARTS:
		Not(in=sel, out=nsel);
		And(a=a, b=nsel, out=o1);
		And(a=b, b=sel, out=o2);
		Or(a=o1, b=o2, out=out);
}