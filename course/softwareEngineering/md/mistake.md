# Refactoring (重構)

## Why ?

1. Requirements Change
2. Design need to be improved
3. Slopiness / Laziness (Copy & Paste ....)

## Typeof Refactoring

https://classroom.udacity.com/courses/ud805/lessons/3608718991/concepts/4421088260923

1. Collapse Hierarchy : a. 子類別太像母類別，乾脆合併。
    * ex : 
2. Consolidate Conditional Expression : 把條件式用 boolean 函數表示，意義更清楚。
    * ex: summer(date)
3. Decompose Conditionals. 
    * ex: 夏天冬天票價不同 if summer(date) summerPrice() else winterPrice()
4. Extract Class : 發現一個類別開始做兩個類別的事情時，乾脆抽出一個新類別，變成兩個。
    * ex: Person => Person + Phone Number
5. Inline Class : 當發現一個類別沒做甚麼事時，乾脆把feature併到其他類別後刪除之。
    * ex: Person + Office => Person (with Office number)
6. Extract Method : 
    * ex: PrintOwing() => PringOwing() { ... printDetails() ... }
    * video : https://classroom.udacity.com/courses/ud805/lessons/3608718991/concepts/4404287920923

## Risk

1. 可能影響其他元件，讓系統失效或產生 bug.
2. 在 production 當中，特別是後期已完成 System Test 之後，別輕易重構！

## Cost

1. Manual Work (修改的代價)
2. Test development and maintenance (測試案例可能需要跟著修，還要重新測試，....)
3. Documentation Maintenance (文件也要跟著修，還要充新建置出版)

## When not to Refactor ?

1. When code is broken
2. When a deadline is close (交期近了)
3. When there is no reason to !

## Bed Smealls

1. Duplicated code => extract method
2. Long method => extract method, decompose conditional, ...
3. Large class => extract class (or subclass)
4. Long parameter list
5. Divergent change
6. Shotgun supgery => move method/field, inline class
    * 現象：每次改了一個地方，就得連動改很多其他物件的程式碼
7. Feature envy => extract method, move method
    * 現象： 每次改某物件就得改另一物件。
8. Data clumps
9. Primitive Obs...?
10. Switch Statements
11. Parallel interface hierarchy
12. Lazy class
13. Speculative generality
14. Temporary field
15. Message Chains
16. Middle man
17. Inappropriate intimacy
18. Incomplete library class
19. Data class
20. Refused ...