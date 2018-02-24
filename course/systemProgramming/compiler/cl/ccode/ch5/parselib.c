#include <stdio.h>
#define BOOL int
char *text, token[100];
int  ti = 0;
#define ch text[ti]

#define cmember(c,set) (c != '\0' && strchr(set,c))

void cnext() {
	printf("%c", ch);
	ti++;
}

BOOL isHead(char *head) {
  int len = strlen(head);
  return strncmp(head, &text[ti], len)==0;
}

void skip(char *head) {
  if (isHead(head)) {
	printf("%s", head);
	ti += strlen(head);
  } else {
	printf("cskip fail!");
	exit(1);
  }
}

void init(char *s) { 
	text = s;
	token[0]='\0'; 
}

char *scan(char *format) {
	if (sscanf(&text[ti], format, token) > 0) {
		ti += strlen(token);
		return token;
	} else {
		printf("scan fail!");
		exit(1);
		return NULL;
	}
}

BOOL next(char *format, char *options) {
	scan(format);
	return (strstr(options, token)>=0);
}
