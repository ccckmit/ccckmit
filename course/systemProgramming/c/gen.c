#include <stdio.h>
#include <stdlib.h>

char *randPrint(char *a[], int size) {
  int r = rand()%size;
  printf(" %s ", a[r]);
}

/*
S = NP VP
NP = DET N
VP = V NP
N = dog | cat
V = chase | eat
DET = a | the
*/

char *n[] = {"dog", "cat"};
void N() { 
  randPrint(n, 2);
}

char *v[] = {"chase", "eat"};
void V() {
  randPrint(v, 2);
}

char *det[] = {"a", "the"};
void DET() {
  randPrint(det, 2);
}

void NP() { DET(); N(); }

void VP() {	V(); NP(); }

void S() { NP(); VP(); }

int main() {
  srand(time(NULL));
  S();
}
