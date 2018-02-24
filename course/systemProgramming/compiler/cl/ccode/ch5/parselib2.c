#include <stdio.h>

char *text;
int  ti;
#define ch text[ti]
#define DIGITS "0123456789"

void cnext() {
	printf("%c", ch);
	ti++;
}

int isNext(char *set) {
	return (ch != '\0' && strchr(set, ch) != NULL);
}

int next(char *set) {
	if (isNext(set))
		cnext();
	else {
		printf("error!");
		exit(1);
	}
}
