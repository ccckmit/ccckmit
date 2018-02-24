#include <stdio.h>

// int randInt(int n):隨機傳回一個小於 n 的整數 (0,1,2..., n-1)
// 用法:randInt(5) 會傳回 0, 1, 2, 3, 4 其中之一
int randInt(int n) { // 隨機傳回一個小於 n 的整數 (0,1,2..., n-1)
  return rand() % n;
}

// int randChar(char *set):隨機傳回 set 中的一個字元
// 用法:randChar("0123456789") 會傳回一個隨機的數字
char randChar(char *set) { // 隨機傳回 set 中的一個字元
  int len = strlen(set);
  int i = rand()%len;
  return set[i];
}

// int randStr(char *set, int size):隨機傳回 set 中的一個字元
// 用法: char *n[] = {"dog", "cat"}; randStr(n, 2) 
//       會傳回 "dog", "cat" 其中之一。
char *randStr(char *set[], int size) { // 隨機傳回 set 中的一個字串
  int i = rand()%size;
  return set[i];
}
