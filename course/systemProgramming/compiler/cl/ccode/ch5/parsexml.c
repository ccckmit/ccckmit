#include "parselib.c"
// === BNF Grammar =====
// XML = <TAG> INNER </TAG>
// TAG = [0-9a-zA-Z]+
// INNER = XML INNER | [^<>]*

int main(int argc, char * argv[]) {
	init("<people><name>ccc</name><tel>313534</tel> at kinmen</people>");
	XML();
}

int XML() { 
	printf("<XML>");
	skip("<"); TAG(); skip(">"); 
	INNER(); 
	skip("</"); TAG(); skip(">"); 
	printf("</XML>");
}

int TAG() { 
	scan("%[0-9a-zA-Z]"); 
	printf("?%s?", token);
}

int INNER() { 
	printf("<INNER>");
	if (isHead("</")) {
	} else if (isHead("<")) {
		XML();
		INNER();
	} else {
		scan("%[^<>]");
		printf("text(%s)", token);
	}	
	printf("</INNER>");
}

