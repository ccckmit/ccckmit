# Min-Max 策略搜尋 -- Alpha-Beta 修剪法

```
  algorithm AlphaBeta(x: node, level, lowBound, maxBound:integer):integer
    if terminal(x) or level=0 then  
       return e(x)
    else
       ans = lb
       for i=1 to childNumber do
         temp = -alphaBeta( child[i], level-1, -maxBound, -ans)
         if ans < temp then ans = temp
         if ans > maxBound then break
       endfor
       ab = ans
    endif
  end algorithm
```

## 參考文獻
