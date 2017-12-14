// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/PC.hdl

/**
 * A 16-bit counter with load and reset control bits.
 * if      (reset[t] == 1) out[t+1] = 0
 * else if (load[t] == 1)  out[t+1] = in[t]
 * else if (inc[t] == 1)   out[t+1] = out[t] + 1  (integer addition)
 * else                    out[t+1] = out[t]
 */

CHIP PC {
    IN in[16],load,inc,reset;
    OUT out[16];

    PARTS:
    Or(a=load, b=inc, out=loadInc);
    Or(a=loadInc, b=reset, out=loadIncReset);

    Register(in=if3, load=loadIncReset, out=o);
    Inc16(in=o, out=oInc);
    And16(a=o, b=o, out=out);
    
    Mux16(a=o,   b=oInc,  sel=inc,   out=if1);
    Mux16(a=if1, b=in,    sel=load,  out=if2);
    Mux16(a=if2, b=false,  sel=reset, out=if3);
}
