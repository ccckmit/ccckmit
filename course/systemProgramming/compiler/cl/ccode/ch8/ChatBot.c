// 注意，本程式用 big5 編碼，會有「許蓋功」的衝碼問題，請勿使用「許蓋功」等字。
#include <stdio.h>
#include <time.h>
#define LEN 512
#define QMAX 10
#define AMAX 20
char *empty="";

typedef struct {
	char *q[QMAX];
	char *a[AMAX];
} QA;

QA qa[]={
{ .q={"謝謝", NULL}, .a={"不客氣!", NULL} }, 
{ .q={"對不起", "抱歉", "不好意思", NULL}, .a={"別說抱歉 !", "別客氣，儘管說 !", NULL} }, 
{ .q={"可否", "可不可以", NULL}, .a={"你確定想%s", NULL} }, 
{ .q={"我的", NULL}, .a={"你的%s?", NULL} }, 
{ .q={"我", NULL}, .a={"你為何%s", NULL} }, 
{ .q={"你是", NULL}, .a={"你認為我是%s", NULL} }, 
{ .q={"認為", "以為", NULL}, .a={"為何說%s?", NULL} }, 
{ .q={"感覺", NULL}, .a={"常有這種感覺嗎?", NULL} }, 
{ .q={"為何不", NULL}, .a={"你希望我%s", NULL} }, 
{ .q={"是否", NULL}, .a={"為何想知道是否%s", NULL} }, 
{ .q={"不能", NULL}, .a={"為何不能%s?", "你試過了嗎?", NULL} }, 
{ .q={"我是", NULL}, .a={"你好，久仰久仰!", NULL} }, 
{ .q={"甚麼","什麼","何時","誰","哪裡","如何","為何","因何", NULL}, 
  .a={"為何這樣問?","為何你對這問題有興趣?","你認為答案是甚麼呢?", NULL} }, 
{ .q={"原因", NULL}, .a={"這是真正的原因嗎?", "這是真正的原因嗎?", NULL} }, 
{ .q={"理由", NULL}, .a={"這說明了甚麼呢?", "還有其他理由嗎?", NULL} }, 
{ .q={"你好","嗨","您好", NULL}, .a={"你好，有甚麼問題嗎?", NULL} }, 
{ .q={"或者", NULL}, .a={"你好像不太確定?", NULL} }, 
{ .q={"你是", NULL}, .a={"你認為我是%s", NULL} }, 
{ .q={"不曉得","不知道", NULL}, .a={"為何不知道?","在想想看，有沒有甚麼可能性?", NULL} }, 
{ .q={"不想","不希望", NULL}, .a={"有沒有甚麼辦法呢?","為何不想%s?","那你希望怎樣呢?", NULL} }, 
{ .q={"想","希望", NULL}, .a={"為何想%s?","真的想%s?","那就去做阿?","為何不呢?", NULL} }, 
{ .q={"不", NULL}, .a={"為何不%s?", NULL} }, 
{ .q={"請", NULL}, .a={"我該如何%s","你想要我%s", NULL} }, 
{ .q={"你", NULL}, .a={"你真的是在說我嗎?","別說我了，談談你吧!","為何這麼關心我%s","你自己%s", NULL} }, 
{ .q={"總是","常常", NULL}, .a={"能不能具體說明呢?","何時?", NULL} }, 
{ .q={"像", NULL}, .a={"有多像?","哪裡像?", NULL} }, 
{ .q={"對", NULL}, .a={"你確定嗎?","我了解!", NULL} }, 
{ .q={"朋友", NULL}, .a={"多告訴我一些有關他的事吧!","你認識他多久了呢?", NULL} }, 
{ .q={"電腦", NULL}, .a={"你說的電腦是指我嗎?", NULL} }, 
{ .q={"難過", NULL}, .a={"別想它了","別難過","別想那麼多了","事情總是會解決的 ", NULL} }, 
{ .q={"高興", NULL}, .a={"不錯ㄚ","太棒了","這樣很好ㄚ", NULL} }, 
{ .q={"是阿", "是的", NULL}, .a={"甚麼事呢?","我可以幫助你嗎?","我希望我能幫得上忙!", NULL} }, 
{ .q={"電腦", NULL}, .a={"你說的電腦是指我嗎?", NULL} }, 
{ .q={NULL}, .a={"我了解","我能理解","還有問題嗎 ?","請繼續說下去","可以說的更詳細一點嗎?",
"這樣喔! 我知道!","然後呢? 發生甚麼事?","再來呢? 可以多說一些嗎","接下來呢? ","可以多告訴我ㄧ些嗎?",
"多談談有關你的事，好嗎?","祝福你","想多聊ㄧ聊嗎", NULL} }
};

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
	char question[LEN];
	printf("您好，我的朋友! 有心事嗎 ?\n");
    do {
        printf(">> ");
        gets(question);
        answer(question);
    } while (!strcmp(question, "再見")==0);
}
