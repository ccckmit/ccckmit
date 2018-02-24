#include <locale.h>
#include <stdio.h>

int uinit() {
    if (!setlocale(LC_CTYPE, "")) {
        fprintf(stderr, "setlocale() 失敗，請檢查 LANG, LC_CTYPE, LC_ALL.\n");
        return 1;
    }
}

FILE *uopen(char *fname, char *mode) {
    FILE* file=fopen(fname, mode);
	wchar_t magic = 0xFEFF; // 魔數為 0xFEFF
	if (mode[0] == 'r') {
		wchar_t head = fgetwc(file);
		if (head != magic)
			return NULL;
	} else {
		fputwc(magic, file); // 輸出魔數到檔案		
	}
	return file;
}

wchar_t* ureadtext(char *fileName) {
  FILE *file = uopen(fileName, "rb");
  fseek(file, 0 , SEEK_END);
  long size = ftell(file);
  rewind(file);
  wchar_t *text = (wchar_t*) malloc(size+sizeof(wchar_t));
  int len = size/sizeof(wchar_t);
  fread(text, sizeof(wchar_t), len, file);
  fclose(file);
  text[len] = L'\0';
  return text;
}

void uwritetext(char *fileName, wchar_t *text) {
  FILE *file = uopen(fileName, "wb");
  fwrite(text, sizeof(wchar_t), wcslen(text)+1, file);
}
