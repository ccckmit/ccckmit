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

// === BNF Grammar =====
// E = T [+-*/] E | T
// T = [0-9]+ | (E)

int main(int argc, char * argv[]) {
	text = argv[1];
	ti = 0;
	E();
}

int E() {
	printf("<E>");
	T();
	if (isNext("+-*/")) {
		cnext();
		E();
	}
	printf("</E>");
}

int T() {
	printf("<T>");
	if (isNext(DIGITS)) {
		while (isNext(DIGITS)) {
			cnext();
		}
	} else if (isNext("(")) {
		cnext();
		E();
		cnext();
	} else if (ch != '\0') {
		printf("error!");
	}
	printf("</T>");
}
