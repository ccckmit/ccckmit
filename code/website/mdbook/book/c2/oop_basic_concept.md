#物件導向的基本概念 -- 封裝，繼承，多型

C 語言雖然不是一種物件導向的語言，但是由於具有函數指標 (function pointer) 與結構 (struct)，因此可以讓我們模擬出類似物件導向的語法。在本章中，我們將說明如何用 C 語言設計物件導向的程式。

物件導向語言大致上具有三個主要的特徵 -- 「封裝、繼承與多型」，以下是這三種特徵的基本描述與範例。

封裝：將資料與函數放在一種稱為物件的結構中。

繼承：子物件可以繼承父物件的所有欄位與屬性，並且可以新增欄位或修改函數。

多型：多種不同的子物件繼承同一種上層物件時，我們可以用上層物件容納之，在呼叫時仍然會根據真實物件型態呼叫對應的子物件函數。

物件導向的三種基本特徵

**封裝：**

```java
class Shape {
  double area() { return 0.0; }
}
```

**繼承：**

```java
class Circle extends Shape {
  public double r;
  Circle(double pr) { r = pr; }
  double area() { return 3.14*r*r; }
}
```
**多型：**

```java
Shape s[] = { new Shape(), new Circle(3.0) };
for (int i=0; i<s.length; i++)
  System.out.println("area()="+s[i].area());
```
###完整程式範例

```java
class Shape {
  double area() { return 0.0; }

  public static void main(String[] argv) {
    Shape s[] = { new Shape(), new Circle(3.0) };
    for (int i=0; i<s.length; i++)
      System.out.println("area()="+s[i].area());
  }
}

class Circle extends Shape {
  public double r;
  Circle(double pr) { r = pr; }
  double area() { return 3.14*r*r; }
}
```

**執行結果**

    D:\cp>javac Shape.java

    D:\cp>java Shape
    area()=0.0
    area()=28.259999999999998
在本文中，我們介紹了如何實作封裝、繼承、多型等三種物件導向的基本特性，在本章的後續小節中，我們將同樣以 Shape 這個範例，說明如何用 C 語言實作出這些物件導向功能。

#來自 jserv 的建議

>"""
>C 語言雖然不是一種物件導向的語言，但是由於具有函數指標 (function pointer) 與結構
(struct)，因此可以讓我們模擬出類似物件導向的語法。在本章中，我們將說明如何用 C 語言設計物件導向的程式。
"""

>=> 說法不精確，object-oriented programming (OOP) [1] 是種 programming
paradigm，用淺顯的話語，就是「物件導向是一種程式開發的態度」，請不要把 OOP 和 OOPL 混淆了，後者是程式語言層面提供 OO
思維。我建議改為以下:
"""
C 語言一開始並非針對物件導向程式開發而設計的程式語言，但我們可藉由函式指標和結構體，將物件導向落實在 C 程式中。
"""
注意: C 語言規格書出現 "object" 字樣近八百次！

>另外，內文還提到:
"""
物件導向語言大致上具有三個主要的特徵 — 「封裝、繼承與多型」，以下是這三種特徵的基本描述與範例。
"""
=> 這個說法不正確，不該把「落實物件導向的機制」當作物件導向，這樣因果錯位實在不好。OOP 的落實有兩種方向：
(a) object-based: 如 Java, C++
(b) prototype-based: 如 JavaScript

>後者在 C 語言的落實機制可見拙作: http://blog.linux.org.tw/~jserv/archives/002057.html

>[1] OOP: https://en.wikipedia.org/wiki/Object-oriented_programming