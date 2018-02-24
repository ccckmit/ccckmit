#include "unicode.c"

#define UMAX 65536 // UTF16 的字最多 65536 個。
wchar_t zmap[UMAX] /*繁轉簡表格*/, smap[UMAX]/*簡轉繁表格*/;

int main(int argc, char *argv[]) {
	uinit(); // 初始化
	tsmap();		// 設定簡繁轉換表
	if (argc != 4) help(); // 檢查參數
	if (strcmp(argv[1], "t2s")==0)// 如果是 t2s，繁轉簡
		translate(zmap, argv[2], argv[3]);
	else if (strcmp(argv[1], "s2t")==0)// 如果是 s2t，簡轉繁
		translate(smap, argv[2], argv[3]);
	else // 否則顯示 help()
		help(); 
}

int help() { // 顯示使用方法
	printf("trans <mode> <fromFile> <toFile>\n"
		   "<mode>={z2s or s2z}\n");	
}

// 根據 map 進行轉換。 zmap: 繁轉簡 , smap: 簡轉繁。
int translate(wchar_t *map, char *inFileName, char *outFileName) {
    FILE* inFile=uopen(inFileName, "rb"); 	// 開啟輸入檔 (UTF-16 格式)
    FILE* outFile=uopen(outFileName, "wb");	// 建立輸出檔 (UTF-16 格式)
    while(1) { // 一直讀
		wchar_t c = fgetwc(inFile); // 讀一個字元
		if (feof(inFile)) // 如果已經到檔尾，跳開並結束
			break;
		if (map[c] == 0)  // 如果字元的轉換不存在
			fputwc(c, outFile); // 直接將字元輸出
		else
			fputwc(map[c], outFile); // 否則將轉換後的字元輸出
    }
	fclose(inFile);		// 關閉輸入檔
	fclose(outFile);	// 關閉輸出檔
}

// 載入簡繁轉換表
int tsmap() {
	memset(zmap, 0, sizeof(wchar_t)*UMAX); 	// 清空繁轉簡表格
	memset(smap, 0, sizeof(wchar_t)*UMAX); 	// 清空簡轉繁表格
    FILE* inFile=uopen("t2s.txt", "rb");	// 開啟繁簡對照表 (UTF-16 格式)
    while(!feof(inFile)) {				 	// 一直讀到檔案結束
		wchar_t zs[10];					 
        if (fgetws(zs, 10, inFile)== NULL) 	// 讀入 (繁, 簡)
			break;
		wchar_t z = zs[0], s=zs[1]; 		// 設定 (z=繁, s=簡)
		if (z!=s) {
			zmap[z] = s;					// zmap[繁]=簡
			smap[s] = z;					// smap[簡]=繁
		}
    }
	fclose(inFile);							// 關閉繁簡對照表
}
