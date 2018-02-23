#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>

// int randInt(int n):隨機傳回一個小於 n 的整數 (0,1,2..., n-1)
// 用法:randInt(5) 會傳回 0, 1, 2, 3, 4 其中之一
int randInt(int n) { // 隨機傳回一個小於 n 的整數 (0,1,2..., n-1)
  return rand() % n;
}

// int randChar(char *set):隨機傳回 set 中的一個字元
// 用法:randChar("0123456789") 會傳回一個隨機的數字
int randChar(char *set) { // 隨機傳回 set 中的一個字元
  int len = strlen(set);
  int i = rand()%len;
  return set[i];
}

int timeSeed() {
  long ltime = time(NULL);
  printf("ltime=%ld\n", ltime);
  int stime = (unsigned) ltime/2;
  srand(stime);
}
