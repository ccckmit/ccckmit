#include <stdio.h>
#include <string.h>

int  size    = 3;
char *name[] = { "john", "mary", "george" };
int  age[]   = { 20,     30,     40       };

int findPeople(char *pName, int pSize) {
  int i;
  for (i=0; i<size; i++) {
	if (strcmp(name[i], pName)==0) {
	  return i;
	}
  }
  return -1;
}

int main() {
  int mi = findPeople("mary", size);
  if (mi < 0) {
	printf("not found!\n");
  } else {
	printf("people[%d]: name=%s, age=%d\n", mi, name[mi], age[mi]);
  }
}

