// #include <stdio.h>

// int main() {
//    int R0 = 3;
//    int R1 = 5;
// =>    int R2 = 0;
@0
D=A
@R2
M=D 
//    while (R0 > 0) {
// => loop:
(loop)
// =>    if (R0 <= 0) goto exit1;
@R0
D=M
@exit1
D; JLE

// =>  R2 = R2 + R1;
@R1
D=M 
@R2
M=D+M

// =>  R0 = R0 - 1;
@R0
M=M-1

//     printf("R0=%d R1=%d R2=%d\n", R0, R1, R2);
// =>  goto loop;
@loop
0;JMP

// => exit1:
(exit1)
//    }
    
//     printf("R2=%d\n", R2);
// }
