#include <stdio.h>

char text[] = "Mr. Jamie is a young man.";

char *next(char *text, int *idx, char *token) {	// 取得下一個 token
	int i = *idx;				
	if (text[i] == '\0') return NULL; // 已到尾端
    while (isalpha(text[i])) { 	// 忽略空白
		i++;
    }
	if (i == *idx) i++;	// 如果不是英文字母，取單一字元。
	int len = i-(*idx);
	strncpy(token, &text[*idx], len);
	token[len] = '\0';
	*idx = i; // 前進到下一個字開頭
	return token;
}

int scan(char *text) { // 掃描器的主要功能
	int ti=0;
	char token[100];
    while (next(text, &ti, token)!=NULL) { // 不斷掃描
		printf("%s|", token);
    }
}

int main(int argc, char * argv[]) {	// 掃描器主程式
	scan(text);
}
