// 注意，本程式用 big5 編碼，會有「許蓋功」的衝碼問題，請勿使用「許蓋功」等字。
#include <stdio.h>
#include <time.h>
#include <string.h>

#define LEN 512
char *empty="";

typedef struct {
	char *q[10];
	char *a[20];
} QA;

QA qa[100];

void tokenize(char *str, char *tokens[], char *spliter) {
	int i;
	char *token = strtok(str, spliter);
	for (i=0; token!=NULL; i++) {
		tokens[i] = token;
		token = strtok (NULL, spliter);
	}
	tokens[i] = NULL;
}

void readQA(char *fname) {
	FILE *file = fopen(fname, "r");
	char line[LEN], q[LEN], a[LEN];
	int i;
	for (i=0; !feof(file); i++) {
		fgets(line, LEN, file);
		sscanf(line, "Q:%s A:%s", q, a);
		tokenize(strdup(q), qa[i].q, "|");
		tokenize(strdup(a), qa[i].a, "|");
	}
}

void replace(char *source, char *target, char *from, char *to) {
	char *match = strstr(source, from);
	if (!match)
		strcpy(target, source);
	else {
		int len = match-source;
		strncpy(target, source, len);
		target[len] = '\0';
		sprintf(target+len, "%s%s", to, match+strlen(from));
	}
}
  
void delay(unsigned int secs) {
    time_t retTime = time(0) + secs;    // Get finishing time.
    while (time(0) < retTime);    		// Loop until it arrives.
}

void answer(char *question) {
	int i, qi, ai, acount;
	char *tail=empty;
    for (i=0; qa[i].q[0]!=NULL; i++) {
		for (qi=0; qa[i].q[qi]!=NULL; qi++) {
			char *q = qa[i].q[qi];
			char *match = strstr(question, q);
            if (match != NULL) {
                tail = match+strlen(q);
//				printf("match Q:%s tail:%s\n", q, tail);
				goto Found;
			}
		}
    }
Found:
	for (acount = 0; qa[i].a[acount] != NULL; acount++);
	ai = rand()%acount;
	delay(5+rand()%10);
	char youTail[LEN];
	replace(tail, youTail, "我", "你");
	printf(qa[i].a[ai], youTail);
	printf("\n");
}

int main() {
	readQA("QA.txt");
	char question[LEN];
	printf("您好，我們來聊聊天吧！\n");
    do {
        printf(">> ");
        gets(question);
        answer(question);
    } while (!strcmp(question, "再見")==0);
}
