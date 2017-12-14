// 來源：A Blum Blum Shub implementation in JavaScript.
// -- https://gist.github.com/schas002/757c0b948b469cd591c24f27eb16edf0

/**
*** blum_blum_shub.js ***
An implementation of the Blum Blum Shub pseudorandom number generator proposed 
in 1986 by Lenore Blum, Manuel Blum and Michael Shub that is derived from 
Michael O. Rabin's oblivious transfer mapping.
Blum Blum Shub takes the form
            2
	x    = x  mod M
	 n+1    n
where M = pq is the product of two large primes p and q. At each step of the 
algorithm, some output is derived from x[n+1]; the output is commonly either 
the bit parity of x[n+1] or one or more of the least significant bits of 
x[n+1].
The seed x[0] should be an integer that is co-prime to M (i.e. p and q are not 
factors of x[0]) and not 1 or 0.
The two primes, p and q, should both be congruent to 3 (mod 4) (this guarantees 
that each quadratic residue has one square root which is also a quadratic 
residue) and gcd(phi(p - 1), phi(q - 1)) should be small (this makes the cycle 
length large).
In this implementation, p = 5651 and q = 5623.
This software is licensed under the zlib/libpng license:
Copyright (c) 2016 Andrew Zyabin
This software is provided 'as-is', without any express or implied warranty. In 
no event will the authors be held liable for any damages arising from the use 
of this software.
Permission is granted to anyone to use this software for any purpose, including 
commercial applications, and to alter it and redistribute it freely, subject to 
the following restrictions:
    1. The origin of this software must not be misrepresented; you must not 
    claim that you wrote the original software. If you use this software in a 
    product, an acknowledgment in the product documentation would be 
    appreciated but is not required.
    2. Altered source versions must be plainly marked as such, and must not be 
    misrepresented as being the original software.
    3. This notice may not be removed or altered from any source distribution.
*/

var R = module.exports = {}

var p = 5651;
var q = 5623;
var M = p * q;

var x = undefined;

/** Get the gcd of two numbers, A and B. */
function gcd(a, b) {
	while(a != b) {
		if(a > b) {
			a = a - b;
		} else {
			b = b - a;
		}
	}
	return a;
}

/** Seed the random number generator. */
R.seed = function(s) {
	if(s == 0) {
		throw new Error("The seed x[0] cannot be 0");
	} else if(s == 1) {
		throw new Error("The seed x[0] cannot be 1");
	} else if(gcd(s, M) != 1) {
		throw new Error("The seed x[0] must be co-prime to " + M.toString());
	} else {
		x = s;
		return s;
	}
}

/** Get next item from the random number generator. */
R.next = function () {
	var cachedx = x;
	cachedx = cachedx * x;
	cachedx = cachedx % M;
	x = cachedx;
	return x;
}