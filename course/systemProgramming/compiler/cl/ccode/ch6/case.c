#include "semantics.c"

// 格變語法: Role Action Object by Tools
// 比對範例: semantics("爸爸用榔頭敲釘子") => people:爸爸 knock:敲 object:釘子 hammer:榔頭
// 比對範例: semantics("貓吃魚") => animal:貓 魚 eat:吃 food:魚

char *words[] = {"爸爸", "敲", "釘子", "榔頭", "用", "貓", "吃", "魚", NULL}; // 詞典
char *isList[][2]  // 詞彙與標記的關係串列
= {{"敲", "knock"}, {"爸爸", "people"}, {"釘子", "object"}, {"榔頭", "hammer"}, 
   {"貓", "animal"}, {"吃", "eat"}, {"魚", "food"}, {"魚", "animal"}, {NULL, NULL}}; 
char *cases[][SLOTS] = { // case (格變語法) 
	{ "animal", "eat", "food", NULL }, 
	{ "people", "knock", "object", "hammer"},
	{ NULL, NULL, NULL, NULL }
};

int main() {
	semantics("爸爸用榔頭敲釘子"); 	// 語意解析範例 1
	semantics("貓吃魚");			// 語意解析範例 2
}
