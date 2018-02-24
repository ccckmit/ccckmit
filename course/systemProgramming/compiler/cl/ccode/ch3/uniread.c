#include "unicode.c"

int main(int argc, char *argv[]) {
	uinit();
	wchar_t *text = ureadtext(argv[1]);
	wprintf(L"text=%s", text);
}
