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

<img src="https://latex.codecogs.com/gif.latex?%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%20f(x)%20dx"/>

<p align="center"><img src="https://latex.codecogs.com/gif.latex?%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%20f(x)%20dx"/></p>

<p align="center"><img src="https://latex.codecogs.com/gif.latex?%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%20f(x)%20dx"/></p>

<p align="center"><img src="https://latex.codecogs.com/gif.latex?%5Cbegin%7Bmatrix%7Da_1%26a_2%26a_3%5C%5Cb_1%26b_2%26b_3%5C%5Cc_1%26c_2%26c_3%5Cend%7Bmatrix%7D"/></p>

<p align="center"><img src="https://latex.codecogs.com/gif.latex?%5Cbegin%7Barray%7D%7Blcr%7D%09a%26b%26c%20%5C%5C%20d%26e%26f%20%5C%5C%20etc%09%5Cend%7Barray%7D"/></p>

