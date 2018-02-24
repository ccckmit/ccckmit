#include <stdio.h>

#define BYTE unsigned char

int main() {
	char s[] = "Hello!§A¦n¡Ibig5.";
	int i;
	for (i=0; i<strlen(s); i++) {
		printf("%d:%c ", i, s[i]);
	}
	printf("\n");
	for (i=0; i<strlen(s); ) {
		BYTE b=(BYTE) s[i];
		if (b>=0xA1 && b<=0xF9) {
			printf("%d:%c%c ", i, s[i], s[i+1]);
			i+=2;
		}
		else {
			printf("%d:%c ", i, s[i]);
			i++;
		}
	}
}
