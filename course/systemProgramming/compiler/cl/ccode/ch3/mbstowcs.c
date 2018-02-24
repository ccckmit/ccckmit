#include <stdlib.h>
#include <stdio.h>

int main(void){
  char *str = "Hi!±z¦n";
  wchar_t wstr[10];
  char str2[10];
  mbstowcs(wstr, str, 10);
  printf("%s\n",str);
  printf("%ls\n",wstr);
  wcstombs(str2, wstr, 10);
  printf("%s",str2);
}
