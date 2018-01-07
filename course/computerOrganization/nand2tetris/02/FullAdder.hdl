// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/02/FullAdder.hdl

/**
 * Computes the sum of three bits.
 */

CHIP FullAdder {
    IN a, b, c;  // 1-bit inputs
    OUT sum,     // Right bit of a + b + c
        carry;   // Left bit of a + b + c

    PARTS:
    Xor(a=a, b=b, out=s1);
    Xor(a=s1, b=c, out=sum);
    And(a=a, b=b, out=c1);
    And(a=s1, b=c, out=c2);
    Xor(a=c2, b=c1, out=carry);
}