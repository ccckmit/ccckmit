#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>

#define NODES 5
#define NIL -1
#define eq(a,b) (strcmp(a,b)==0)

char *text;
int  ti = 0;
char empty[] = "";

typedef struct _Node {
  char *type;
  char *value;
  struct _Node *childs[NODES];
  int  childCount;
} Node;

Node nodes[1000];
int nodeTop = 0;

Node *stack[100];
int stackTop = 0;

char space[512];

char* spaces(int n) {
	memset(space, ' ', n);
	space[n] = '\0';
	return space;
}

Node *nodeNew(char *type) {
	Node *node = &nodes[nodeTop++];
	node->type = strdup(type);
	node->value = empty;
	node->childCount = 0;
	memset(node->childs, 0, sizeof(Node*)*NODES);
	return node;
}

Node *push(char *type) {
	printf("%s+%s\n", spaces(stackTop), type);
	Node *parent = NULL;
	Node *node = nodeNew(type);
	if (stackTop >= 1) {
		parent = stack[stackTop-1];
		parent->childs[parent->childCount++] = node;
	}
    stack[stackTop++] = node;
	return node;
}

Node* pop(char *type) {
    stackTop--;
    Node* node = stack[stackTop];
    assert(strcmp(node->type, type)==0);
	printf("%s-%s\n", spaces(stackTop), type);
    return node;
}

int level=0;
Node* tree(Node *node, int level) {
	printf("%s+%s:%s\n", spaces(level), node->type, node->value);
	int i=0;
	for (i=0; i<node->childCount; i++)
		tree(node->childs[i], level+1);
	printf("%s-%s\n", spaces(level), node->type);
}

// === BNF Grammar =====
// S = NP VP PP
// NP = D N
// VP = V NP

Node* match(char *name, char *words) {
	Node *node = push(name);
	char token[100], word[100];
	if (sscanf(&text[ti], "%[a-z] ", token)>0) {
		ti += strlen(token);
		printf("%s%s\n", spaces(stackTop), token);
		node->value = strdup(token);
		sprintf(word, "|%s|", token);
		assert(strstr(words, word)>=0);
		sscanf(&text[ti], "%[ ]", token);
		ti += strlen(token);
	}
	pop(name);
}

Node* D() { return match("D", "|the|a|"); }

Node* N() { return match("N", "|dog|cat|lady|"); }

Node* V() { return match("V", "|chase|eat|"); }

Node* P() { return match("P", "|in|on|at|of|"); }

Node* NP() { push("NP"); D(); N(); return pop("NP"); }

Node* VP() { push("VP"); V(); NP(); return pop("VP"); }

Node* PP() { push("PP"); P(); NP(); return pop("PP"); }

Node* S() { push("S"); NP(); VP(); PP(); return pop("S"); }

// === BNF Grammar =====
// 英文語法		 	中文語法
// S = NP VP PP  	S = NP PP VP
// NP = D N			NP = D Q N
// VP = V NP		VP = V NP

char *animal[] = {"dog", "cat", NULL};
char *people[] = {"lady", "man", NULL};
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

void gen(Node *node) {
	if (node->value != empty) {
		int ei = wordFind(ewords, node->value);
		printf("%s(%s)", node->value, cwords[ei]);
	}
	if (eq(node->type, "S")) {
		Node *np=node->childs[0];
		Node *vp=node->childs[1];
		Node *pp=node->childs[2];
		gen(np);
		gen(pp);
		gen(vp);
	} else if (eq(node->type, "NP")) {
		Node *d = node->childs[0];
		Node *n = node->childs[1];
		char *q;
		if (wordFind(animal, n->value)!=NIL)
			q = "隻";
		else
			q = "個";
		gen(d);
		printf("[%s]", q);
		gen(n);
	} else {
		int i;
		for (i=0; i<node->childCount; i++)
			gen(node->childs[i]);
	}
}

void mt(char *str) {
	text = str;
	printf("============= parse =============\n");
	Node *s = S();
	printf("============= tree  =============\n");
	tree(s, 0);
	printf("============= gen   =============\n");
	gen(s);
	printf("\n");
}

int main(int argc, char * argv[]) {
	mt("a dog chase a lady in the park");
}
