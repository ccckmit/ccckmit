XPCE : SWI-Prolog 的視窗界面
 * http://www.swi-prolog.org/download/xpce/doc/userguide/userguide.pdf

檔案：sort.pl

```prolog
/* sortcsj.pl    原始參考：Computer Science  J. Glenn Brookshear   */
/* sortcsj()中的第二個引數帶有排序好的結果　*/
/* 僅為示範，若為gprolog使用者則用內建sort等較佳 */
/* 在gprolog下之編譯例：gplc --min-size sortcsj.pl　*/
/*   執行 sortcsj 後會出現排序結果 [2,9,18,18,25,33,66,77] */
 
q:- L=[33,18,2,77,18,66,9,25], (sortcsj(L,P), write(P), nl). 
 
sortcsj(L,S) :-  permutation(L,S), ordered(S).	/* L為原list, S為排序好的list, 此為permutation關係(built-in) */
 
ordered([]).			/* 表empty list視為排序好的list */
ordered([_|[]]).			/* 只有一元素之list視為排序好的list */
ordered([A|[B|T]]) :- A =< B, ordered([B|T]).	/* 此??約束所謂的排序好是指前項元素小於或等於後一項元素 */
 
:- initialization(q).		
```

執行

```
D:\Dropbox\Public\web\ai\code\prolog>swipl -f sort.pl -t q
% sort.pl compiled 0.00 sec, 7 clauses
[2,9,18,18,25,33,66,77]
Welcome to SWI-Prolog (Multi-threaded, 64 bits, Version 6.6.1)
Copyright (c) 1990-2013 University of Amsterdam, VU Amsterdam
SWI-Prolog comes with ABSOLUTELY NO WARRANTY. This is free software,
and you are welcome to redistribute it under certain conditions.
Please visit http://www.swi-prolog.org for details.

For help, use ?- help(Topic). or ?- apropos(Word).

[2,9,18,18,25,33,66,77]
% halt
```