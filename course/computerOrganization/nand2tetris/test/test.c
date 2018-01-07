#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
  char line[100] = "//aaa//bbb / ccc";
  printf("line=%s\n", line);
  strtok(line, "/\r\n");
  printf("line=%s\n", line);
  strpbrk(line, "/\r\n");
  printf("line=%s\n", line);
  char code[100] = "@13";
  int number;
  int count = sscanf(code, "@%d", &number);
  printf("count=%d number=%d", count, number);
}
