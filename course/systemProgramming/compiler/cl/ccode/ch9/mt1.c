#include <stdio.h>
#include <string.h>
#define NIL -1
char *ewords[] = {"a",  "the", "cat", "dog", "lady", "chase", "bite", "park", "in", NULL};
char *cwords[] = {"一", "這",  "貓",  "狗",  "女人", "追",    "咬",   "公園", "在", NULL};

// 尋找詞典中是否有這個詞彙
int wordFind(char *words[], char *word) {
    int i;
    for (i=0; words[i]!=NULL; i++) {
        if (strncmp(word, words[i], strlen(words[i]))==0)
            return i;
    }
    return NIL;
}

void mt(char *s, char *swords[], char *twords[]) {
	char *spliter=",;. ";
	char *sword = strtok(s, spliter);
	while (sword != NULL) {
		int si = wordFind(swords, sword);
		if (si!=NIL) {
			printf("%s(%s) ", swords[si], twords[si]);
		}
		sword = strtok(NULL, spliter);
	}
}

int main(int argc, char * argv[]) {
	char english[] = "a dog chase a lady in the park";
	mt(english, ewords, cwords);
}