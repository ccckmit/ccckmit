# 在 github 中顯示數學式

## 使用方法

搭配 vscode 中的 Markdown Preview Enhanced，您可以事先在 vscode 中按 ctrl-K-V 檢視，沒問題後使用 gulp 指令進行轉換。

## MimeTex

我們使用 codecogs 網站中的 mimetex 程式
https://latex.codecogs.com/gif.latex? 來將數學式轉換成影像，以下是該程式的網址與範例：

* https://www.codecogs.com/latex/eqneditor.php
  * https://latex.codecogs.com/gif.latex?\int%20f(x)%20dx

mimetex 支援的語法請參考：

* http://abenteuer-universum.de/mimetex.html#reference

## 以下是一些轉換範例

$\int_{0}^{\infty} f(x) dx$

$$\int_{0}^{\infty} f(x) dx$$

$$
\int_{0}^{\infty} f(x) dx
$$

$$
\begin{matrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{matrix}
$$

$$
\begin{array}{lcr}	a&b&c \\ d&e&f \\ etc	\end{array}
$$

