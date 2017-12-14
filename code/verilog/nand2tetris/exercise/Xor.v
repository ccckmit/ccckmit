// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/01/Xor.hdl

/**
 * Exclusive-or gate:
 * out = not (a == b)
 */

CHIP Xor {
    IN a, b;
    OUT out;

    PARTS:
    Nand (a=a, b=b, out= AnandB);
    Or   (a=a, b=b, out= AorB);
    And  (a=AnandB, b=AorB, out=out);
}