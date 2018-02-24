#include <stdio.h>
 
char *innerText(char *inner, char *pText, char *beginMark, char *endMark) {
     char *beginStart = strstr(pText, beginMark);
     if (beginStart == NULL) return NULL;
     char *beginEnd = beginStart + strlen(beginMark);
     char *endStart = strstr(beginEnd, endMark);
     if (endStart < 0) return NULL;
     int len = endStart-beginEnd;
     strncpy(inner, beginEnd, len);
     inner[len] = '\0';
}
 
int main() {
    char xml[] = "<people name=\"陳鍾誠\" sex=\"男\">"
		  "<age>43</age>"
		  "<hometown>金門縣</hometown>"
		 "</people>";
    char name[30], sex[10], age[10], hometown[30];
    innerText(name, xml, "name=\"", "\"");
    printf("name=%s\n", name);
    innerText(sex,  xml, "sex=\"", "\"");
    printf("sex=%s\n", sex);
    innerText(age,  xml, "<age>", "</age>");
    printf("age=%s\n", age);
    innerText(hometown,  xml, "<hometown>", "</hometown>");
    printf("hometown=%s\n", hometown);
}
