#include <stdio.h>
#include <string.h>

#define SIZE 3

typedef struct {
  char *name;
  int  age;
} People;

People peoples[] = {
  { .name="john", .age=20}, 
  { .name="mary", .age=30}, 
  { .name="george", .age=40}
};

int findPeople(char *pName, int pSize) {
  int i;
  for (i=0; i<pSize; i++) {
	if (strcmp(peoples[i].name, pName)==0) {
	  return i;
	}
  }
  return -1;
}

int main() {
  int mi = findPeople("mary", SIZE);
  if (mi < 0) {
	printf("not found!\n");
  } else {
	printf("people[%d]: name=%s, age=%d\n", mi, peoples[mi].name, peoples[mi].age);
  }
}

