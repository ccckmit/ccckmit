// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/01/DMux4Way.hdl

/**
 * 4-way demultiplexor:
 * {a, b, c, d} = {in, 0, 0, 0} if sel == 00
 *                {0, in, 0, 0} if sel == 01
 *                {0, 0, in, 0} if sel == 10
 *                {0, 0, 0, in} if sel == 11
 */

CHIP DMux4Way {
    IN in, sel[2];
    OUT a, b, c, d;

    PARTS:
    Not(in=sel[1], out=nsel1);
    Not(in=sel[0], out=nsel0);
    And(a=nsel1,  b=nsel0,  out=sel00);
    And(a=nsel1,  b=sel[0], out=sel01);
    And(a=sel[1], b=nsel0,  out=sel10);
    And(a=sel[1], b=sel[0], out=sel11);
    DMux(in=in, sel=sel00, a=d0, b=a);
    DMux(in=in, sel=sel01, a=d1, b=b);
    DMux(in=in, sel=sel11, a=d2, b=d);
    DMux(in=in, sel=sel10, a=d3, b=c);
}