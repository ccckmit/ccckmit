var S = require("../lib/set");

var S10 = S.Finite(10);
print('S10.sample(5)=', S10.sample(5));
print('Float.sample(5)=', S.Float.sample(5));
print('Z.sample(5)=', S.Z.sample(5));
print('Even.sample(5)=', S.Even.sample(5));
print('Odd.sample(5)=', S.Odd.sample(5));
print('Prime.sample(5)=', S.Prime.sample(5));
print('Prime.enumerate()=', S.Prime.enumerate());
print('Empty.sample(5)=', S.Empty.sample(5));
var OddPrime = S.Odd.intersection(S.Prime);
OddPrime.enumHead = [3,5,7,11,13];
print('OddPrime.sample(5)=', OddPrime.sample(5));
print('OddPrime.has(71)=', OddPrime.has(71));
print('OddPrime.has(70)=', OddPrime.has(70));
print('OddPrime.has(69)=', OddPrime.has(69));
var OddXPrime = S.Odd.cartesianProduct(S.Prime);
print('OddXPrime.has([9,71])=', OddXPrime.has([9, 71]));
print('OddXPrime.has([8,71])=', OddXPrime.has([8, 71]));
print('OddXPrime.has(71)=', OddXPrime.has(71));
// RussellSet
print('NoSelf.has(Odd)=', S.NoSelf.has(S.Odd));
print('NoSelf.has(NoSelf)=', S.NoSelf.has(S.NoSelf));
