// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/01/Or8Way.hdl

/**
 * 8-way Or: 
 * out = (in[0] or in[1] or ... or in[7])
 */

CHIP Or8Way {
    IN in[8];
    OUT out;

    PARTS:
    Or(a=in[7], b=in[6], out=or76);
    Or(a=in[5], b=in[4], out=or54);
    Or(a=in[3], b=in[2], out=or32);
    Or(a=in[1], b=in[0], out=or10);
    Or(a=or76, b=or54, out=or74);
    Or(a=or32, b=or10, out=or30);
    Or(a=or74, b=or30, out=out);
}