# 錯誤處理

| 主題 | 說明 |
| -- | -- |
| [錯誤代號與訊息](Error%20codes%20and%20messages.md) |(errno, strerror, perror) 與錯誤代號相關的訊息輸出方法 |
| [錯誤訊息列表](Error%20Message%20List.md)|用 strerror 列出所有內建的錯誤訊息 |
| [檔案錯誤](Processing%E3%80%80File%20Error.md) | (ferror,clearerr) 檔案讀取寫入錯誤，清除錯誤，繼續執行下去 |
| [短程跳躍](Short%20jump.md) | (goto) 函數內的跳躍，不可跨越函數 |
| [長程跳躍](Long-range%20jump.md) | (setjump 與 longjump) 在錯誤發生時，儲存行程狀態，執行特定程式的方法 |
| [訊號機制](Signal%20Mechanism.md) | (signal) 攔截中斷訊號的處理機制 |
| [模擬 try ... catch](Analog%20try%20...%20catch.md) | 使用跳躍機制 (setjump, longjump) 模擬 try … catch 的錯誤捕捉機制 |

