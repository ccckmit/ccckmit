#include "semantics.c"

// 劇本比對：使用格變語法
char *sentences[] = 
{"約翰與瑪莉是大學的同班同學", "在大三時約翰愛上了瑪莉", "畢業後他們就結婚了", 
"並且生了一個小男孩麥克", "約翰畢業後進入一家大公司工作", "由於表現良好，所以被拔擢為經理", 
"妮可是他的秘書", "由於工作上朝夕相處，以致約翰與妮可日久生情", "當瑪莉發現約翰與妮可的外遇事件後", 
"她決定離婚", "並且取得了麥克的監護權。", "而兩人離婚之後不久", "約翰與妮可就結婚了。"};

char *words[] = {"日久生情", "約翰", "瑪莉", "妮可", "麥克", "結婚", "他們", "他們", "外遇", "離婚", "愛", "生", NULL}; // 詞典

char *isList[][2]  // 詞彙與標記的關係串列
= {{"日久生情", "love"},  {"約翰", "man"}, {"瑪莉", "woman"}, {"妮可", "woman"}, {"麥克", "man"}, 
   {"麥克", "baby"}, {"他們", "man"}, {"他們", "woman"}, {"外遇", "extramarital"}, 
   {"結婚", "marry"}, {"離婚", "divorce"}, {"愛", "love"}, {"生", "born"}, 
   {"他", "man"}, {"她", "woman"}, {NULL, NULL}}; 
char *cases[][SLOTS] = { // case (格變語法) 
	{ "man", "love", "woman", NULL },	// 男人 愛 女人
	{ "man", "date", "woman", NULL}, 	// 男人 女人 交往
	{ "man", "marry", "woman", NULL},	// 男人 女人 結婚
	{ "man", "sex", "woman", NULL},		// 男人 女人 交配
	{ "woman", "born", "baby", NULL},	// 女人 生 小孩
	{ "baby", "growup", NULL, NULL},	// 小孩 長大
	{ "man", "woman", "extramarital", NULL}, // 外遇[男人 (交配|愛) 另一個女人]
	{ "man", "divorce", "woman",  NULL}, // 男人 女人 離婚
	{ NULL, NULL, NULL, NULL }
};

int main() {
	int i;
	for (i=0; sentences[i] != NULL; i++)
		semantics(sentences[i]);
}
