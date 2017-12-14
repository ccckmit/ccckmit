## 繪圖加速功能 (Graphics) 

在 3D 的遊戲或動畫的運算當中，經常要計算向量的加法、內積的浮點數運算，而且這些運算通常獨立性很高，可以採用平行的方式計算，所以就需要在繪圖處理器 GPU 當中內建很多平行的向量式浮點運算器來加速此一計算過程。

舉例而言，當我們想計算下列的 N 維向量加法時，如果採用 GPU 就會快上很多：

```CPP
for (i=0; i<N; i++)
  C[i] = A[i]+B[i];
```

當這樣的程式被放到 GPU 去執行時，可能會翻譯出如下的組合語言。

```
		LD	 		R1, N
		LD			R2, A
		LD			R3, B
		LD			R4, C
LOOP:	VectorLoad	V2, [R2]
		VectorLoad  V3, [R3]
		VectorAdd   V4, V2, V3
		VectorStore V4, [R4]
		ADD			R2, R2, 4*L
		ADD			R3, R3, 4*L
		ADDd		R4, R4, 4*L
		SUB			R5, R5, L
		CMP			R5, R0
		JGE			LOOP
```

如果上述 GPU 的一次可以計算的浮點長度為 L 個，那麼整個計算幾乎就可以快上 L 倍了。

GPU 通常有著與 CPU 不同的指令集，像是 GPU 大廠 NVIDIA 的 CUDA 就是一種 GPU 指令集， NVIDIA 甚至還為 CUDA 設計了一種擴充式的 C 語言 -- 稱為 CUDA C，這種 C 語言可以用標記指定哪些部份應該展開到 CPU 當中，哪些應該展開到 GPU 當中，以及如何有效的運用 GPU 進行向量計算等等。甚至、 CUDA 還提供了專用的函式庫，以便讓 CUDA C 能夠方便的呼叫這些常用的繪圖函數。

另外、為了讓各家廠商的 CPU 與 GPU 可以更有效的合作，甚至有組織制定了一種稱為 OpenCL 的標準，可以讓各家廠商的 CPU 與 GPU 可以在一個標準架構下進行協同運算，以便有效的運用這些異質處理器的效能。

