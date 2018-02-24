#include "unicode.c"

#define LEN 512

int main(int argc, char *argv[]) {
	uinit(); // 初始化
	cedict();		// 設定簡繁轉換表
}

// 載入 CC-CEDICT
int cedict() {
    FILE* inFile=uopen("cedict_ts.u16le", "rb");	// 開啟 CC-CEDICT
    FILE* outFile=uopen("cedict_log.u16le", "wb");
    while(!feof(inFile)) {				 	// 一直讀到檔案結束
		wchar_t line[LEN], head[LEN], tail[LEN], tc[LEN], sc[LEN], pr[LEN], en[LEN];
        if (fgetws(line, LEN, inFile)== NULL) 	// 讀入 (繁, 簡)
			break;
		if (line[0] == '#') continue;
		fwprintf(outFile, L"line=%ls", line);
		swscanf(line, L"%s %s [%[^]]] /%[^/]", tc, sc, pr, en);
		fwprintf(outFile, L"tc=%ls sc=%ls pr=%ls en=%ls\n\n", tc, sc, pr, en);
    }
	fclose(inFile);	// 關閉輸入檔 CC-CEDICT
	fclose(outFile); // 關閉 log 輸出檔
}
