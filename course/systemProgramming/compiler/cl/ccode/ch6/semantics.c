#include <stdio.h>
#include <assert.h>

#define NIL -1				// 找不到時傳回 NIL
#define SLOTS 4				// 一個 case 的最多 slot 數量
#define FILLS 4				// 每個 SLOT 最多填入詞彙數
#define TOKENS 1000			// 一個句子中最多詞彙上限
#define SMAX 100000			// 字串表容量

char *empty="";				// 空字串
char *slots[SLOTS][FILLS]; 	// 每個欄位的填充值 (可填多個，最多 FILLS 個)
int  fills[SLOTS]; 			// 每個欄位的填充個數
char *tokens[TOKENS];		// 詞彙串列
char strTable[SMAX]; 		// 字串表
int  strTop = 0;	 		// 字串表大小
extern char *words[];		// 詞彙串列
extern char *isList[][2];	// (詞彙, 標記) 配對串列
extern char *cases[][SLOTS];// 格變語法串列

// 將語句斷詞成詞彙串列
int tokenize(char *str, char *tokens[]) {
	int i, ti=0;
	for (i=0; i<strlen(str); ) {
		int wi = wordFind(&str[i]);
		char *ch;
		if (wi == NIL) {
			ch = &strTable[strTop];
			sprintf(ch, "%c%c", str[i], str[i+1]);
			strTop += 3;
		}
		assert(ti < TOKENS);
		tokens[ti] = (wi==NIL)?ch:words[wi];
		i+= strlen(tokens[ti]);
		ti++;
	}
	tokens[ti] = NULL;
}

// 尋找詞典中是否有這個詞彙
int wordFind(char *str) {
	int i;
	for (i=0; words[i]!=NULL; i++) {
		if (strncmp(str, words[i], strlen(words[i]))==0) {
			return i;
		}
	}
	return NIL;
}

// 印出詞彙陣列
int wordsPrint(char *words[]) {
	int i;
	for (i=0; words[i] != NULL; i++) {
		printf("%s ", words[i]);
	}
	printf("\n");
}

// 欄位填充的主要演算法
double caseFill(char *tokens[], char *fields[SLOTS], char *slots[SLOTS][FILLS]) {
	int ti, si, fi, score=0;
	for (si=0; si<SLOTS; si++)
		fills[si] = 0;
	for (ti=0; tokens[ti]!=NULL; ti++) {
		for (si=0; si<SLOTS; si++) {
			if (pairFind(tokens[ti], fields[si], isList)!=NIL) {
				assert(fills[si] < FILLS);
				slots[si][fills[si]++] = tokens[ti];
			}
		}
	}
	for (si=0; si<SLOTS; si++)
		score += fills[si];
	return score;
}

// 尋找出最好的填充規則
int caseBest() {
	int ci, best=0;
	double  bestScore=0.0;
	for (ci=0; cases[ci][0] != NULL; ci++) {
		double score = caseFill(tokens, cases[ci], slots);
		if (score > bestScore) {
			best = ci;
			bestScore = score;
		}
	}
	return best;
}

// 印出填充的情況
int casePrint(char *fields[SLOTS], char *slots[SLOTS][FILLS]) {
	int si, fi;
	for (si=0; si<SLOTS; si++) {
		if (fields[si] != NULL) {
			printf("%s:", fields[si]);
			for (fi=0; fi<fills[si]; fi++)
				printf("%s ", slots[si][fi]);
		}
	}
	printf("\n");
}

// 尋找 (child, parent) 配對是否存在 pairList 當中。
int pairFind(char *child, char *parent, char *pairList[][2]) {
	if (child == NULL || parent == NULL) return NIL;
	int pi=0; 
	for (pi=0; pairList[pi][0] != NULL; pi++) {
		if (strcmp(child, pairList[pi][0])==0 && strcmp(parent, pairList[pi][1])==0)
			return pi;
	}
	return NIL;
}

// 語意解析：以欄位填充方法找出最佳填充的 case，然後印出填充情況。
int semantics(char *str) {
	tokenize(str, tokens); 	// 斷詞
	wordsPrint(tokens); 	// 印出斷詞
	int best = caseBest(); 	// 找出最佳填充
	double score = caseFill(tokens, cases[best], slots); // 重填一次最佳填充
	casePrint(cases[best], slots); // 印出最佳填充
	printf("\n");
}
