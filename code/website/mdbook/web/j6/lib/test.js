module.exports = function (j6) {
// =============== 檢定 ==============================
var T = j6;

T.test = function(o) { // name, D, x, mu, sd, y, alpha, op
  Object.assign(o, {alpha:0.05, op:"="});
  var alpha = o.alpha;
  var pvalue, interval;
  var D      = o.D;
  var q1     = D.o2q(o); // 單尾檢定的 pvalue
  
  if (o.op === "=") {
    if (q1>0.5) q1 = 1-q1; // (q1>0.5) 取右尾，否則取左尾。
    pvalue= 2*q1; // 對稱情況：雙尾檢定的 p 值是單尾的兩倍。
    interval = [D.q2p(alpha/2, o, "L"), D.q2p(1-alpha/2, o, "j6")];
  } else {
    if (o.op === "<") { // 右尾檢定 H0: q < 1-alpha, 
      interval = [ D.q2p(alpha, o, "L"), Infinity ]; 
      pvalue = 1-q1;
    }
    if (o.op === ">") { // 左尾檢定 H0: q > alpha
      interval=[-Infinity, D.q2p(1-alpha, o, "j6")];
      pvalue = q1;
    }
  }
  return { 
    name: o.name,
    h: D.h(o),
    alpha: alpha,
    op: o.op, 
    pvalue: pvalue, 
    ci : interval, 
    df : D.df(o),
    report: function() { j6.report(this) }
  };
}

T.report = function(o) {
  console.log("=========== report ==========");
  for (var k in o) {
    if (typeof o[k] !== "function")
      console.log(k+"\t: "+j6.str(o[k]));
  }
}

var t1 = { // 單樣本 T 檢定 t = (X-mu)/(j6/sqrt(n))
  h:function(o) { return "H0:mu"+o.op+o.mu; }, 
  o2q:function(o) {
    var x = o.x, n = x.length;
    var t = (j6.mean(x)-o.mu)/(j6.sd(x)/Math.sqrt(n)); 
    return j6.pt(t, n-1);
  },
  // P(X-mu/(j6/sqrt(n))<t) = q ; 信賴區間 P(T<q)
  // P(mu > X-t*j6/sqrt(n)) = q ; 這反而成了右尾檢定，所以左尾與右尾確實會反過來
  q2p:function(q, o) {
    var x = o.x, n = x.length;
    return j6.mean(x) + j6.qt(q, n-1) * j6.sd(x) / Math.sqrt(n);
  },
  df:function(o) { return o.x.length-1; }
}

var t2vareq = { // σ1=σ2, 合併 T 檢定 (雙樣本)
  h:function(o) { return "H0:mu1"+o.op+"mu2" }, 
  // j6^2 = (n1-1)*S1^2+(n2-1)*S2^2)/(n1-1+n2-1)
  sd:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var S1= j6.sd(x), S2 = j6.sd(y);
    var j6 = Math.sqrt(((n1-1)*S1*S1+(n2-1)*S2*S2)/(n1-1+n2-1)); 
    return j6;
  },
  // T = ((X-Y)-(mu1-mu2))/(sqrt(1/n1+1/n2)*j6)
  o2q:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var j6 = this.sd(o);
    var t = (j6.mean(x)-j6.mean(y)-o.mu)/(Math.sqrt(1/n1+1/n2)*j6);
    return j6.pt(t, n1+n2-2);
  },
  // t=((X-Y)-mu)/(sqrt(1/n1+1/n2)*j6), (X-Y)-t*sqrt(1/n1+1/n2)*j6 = mu
  q2p:function(q, o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var j6 = this.sd(o);
    return j6.mean(x)-j6.mean(y)+ j6.qt(q, n1+n2-2)*Math.sqrt(1/n1+1/n2)*j6;
  },
  df:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;  
    return n1+n2-2; 
  }
}

var t2paired = { // 成對 T 檢定 T = (X-Y-mu)/(j6/sqrt(n)) (雙樣本)
  h:function(o) { return "H0:mu1"+o.op+"mu2" }, 
  sd:function(o) { // j6 = sd(x-y)
    var x = o.x, n = x.length, y=o.y;
    var j6= j6.sd(j6.sub(x,y));
    return j6;
  },
  o2q:function(o) { 
    var x = o.x, n = x.length, y=o.y;
    var j6 = this.sd(o);
    var t = (j6.mean(j6.sub(x,y))-o.mu)/(j6/Math.sqrt(n));
    return j6.pt(t, n-1);
  },
  // mean(x-y)+t*j6/sqrt(n)
  q2p:function(q, o) {
    var x = o.x, n = x.length, y=o.y;
    var j6 = this.sd(o);
    return j6.mean(j6.sub(x,y))+ j6.qt(q, n-1)*j6/Math.sqrt(n);
  },
  df:function(o) {
    return o.x.length-1; 
  }
}

var t2varneq = { // σ1≠σ2, Welch's t test (雙樣本) (又稱 Smith-Satterwaite 程序)
// 參考：http://en.wikipedia.org/wiki/Welch's_t_test
  h:function(o) { return "H0:mu1"+o.op+"mu2" }, 
  // T = ((X-Y)-(mu1-mu2))/sqrt(S1^2/n1+S2^2/n2)
  o2q:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var S1 = j6.sd(x), S2=j6.sd(y);
    var t = (j6.mean(x)-j6.mean(y)-o.mu)/Math.sqrt(S1*S1/n1+S2*S2/n2);
    return j6.pt(t, this.df(o));
  },
  // t=((X-Y)-mu)/sqrt(S1^2/n1+S2^2/n2), (X-Y)-t*sqrt(S1^2/n1+S2^2/n2) = mu
  q2p:function(q, o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var S1 = j6.sd(x), S2=j6.sd(y);
    return j6.mean(x)-j6.mean(y)+ j6.qt(q, this.df(o))*Math.sqrt(S1*S1/n1+S2*S2/n2);
  },
  df:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;  
    var S1 = j6.sd(x), S2=j6.sd(y);
    var Sn1 = S1*S1/n1, Sn2 = S2*S2/n2, Sn12 = Sn1+Sn2;
    var df = (Sn12*Sn12)/((Sn1*Sn1)/(n1-1)+(Sn2*Sn2)/(n2-1));
    return df;
  }
}

T.ttest = function(o) { 
  var t;
  if (typeof o.y === "undefined") {
    o.name = "ttest(X)";
    o.D = t1;
    t = T.test(o);
    t.mean = j6.mean(o.x);
    t.sd   = j6.sd(o.x);
  } else {
    var varequal = o.varequal || false;
    var paired = o.paired || false;
    if (varequal) {
      o.name = "ttest(X,Y,mu="+o.mu+",varequal=true) (pooled)";
      o.D = t2vareq;
      t = T.test(o);
    } else if (paired) {
      o.name = "ttest(x,y,mu="+o.mu+",paired=true)";
      o.D = t2paired;
      t = T.test(o);
      t.mean = "mean(x-y)="+j6.str(j6.mean(j6.sub(o.x, o.y)));
      t.sd   = "sd(x-y)="+j6.str(j6.sd(j6.sub(o.x, o.y)));
    } else {
      o.name = "ttest(x,y,mu="+o.mu+",varequal=false), Welch t-test";
      o.D = t2varneq;
      t = T.test(o);
    }
    if (typeof t.mean === "undefined") {
      t.mean = "mean(x)="+j6.str(j6.mean(o.x))+" mean(y)="+j6.str(j6.mean(o.y));
      t.sd   = "sd(x)="+j6.str(j6.sd(o.x))+" sd(y)="+j6.str(j6.sd(o.y));
    }
  }
  return t;
}

var f2 = { // 檢定 σ1/σ2 = 1? 
  h:function(o) { return "H0:σ1/σ2"+o.op+"1"; }, 
  // F = S1^2/S2^2
  o2q:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var S1 = j6.sd(x), S2=j6.sd(y);
    var f = (S1*S1)/(S2*S2);
    var pf = j6.pf(f, n1-1, n2-1);
    return pf;
  },
  // 信賴區間公式： S1^2/(S2^2*F(1-α/2), S1^2/(S2^2*F(α/2))
  // 也就是要用 S1^2/(S2^2*f(1-q)) ，參考 j6 軟體、應用統計方法 (陳景祥) 389 頁。
  q2p:function(q, o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    var S1 = j6.sd(x), S2=j6.sd(y);
    var qf = j6.qf(1-q, n1-1, n2-1);
    return (S1*S1)/(S2*S2*qf);
  },
  df:function(o) {
    var x = o.x, n1 = x.length, y=o.y, n2=y.length;
    return [n1-1, n2-1];
  }
}

T.ftest = function(o) { 
  o.name = "ftest(X, Y)";
  o.D = f2;
  var t = T.test(o);
  var rsd = j6.sd(o.x)/j6.sd(o.y);
  t.ratio = (rsd*rsd);
  return t;
}

// j6 軟體沒有此函數，測試請看湯銀才 143 頁
var chisq1 = { // 檢定 σ1 = σ ?
  h:function(o) { return "H0:σ1"+o.op+"σ"; }, 
  // χ(n-1) = (n-1)j6^2/σ^2
  o2q:function(o) {
    var x = o.x, n = x.length, j6=j6.sd(x);
    var v = (n-1)*j6*j6/(o.sd*o.sd);
    return j6.pchisq(v, n-1);
  },
  // 信賴區間公式： (n-1)j6^2/χ^2(1-q)，參考 j6 語言與統計分析 (湯銀才) 142 頁。
  q2p:function(q, o) {
    var x = o.x, n = x.length, j6=j6.sd(x);
    return (n-1)*j6*j6/j6.qchisq(1-q, n-1);
  },
  df:function(o) {
    var x = o.x, n = x.length;
    return n-1;
  }
}

T.chisqtest = function(o) { 
  o.name = "chisqtest(X)";
  o.D = chisq1;
  return T.test(o);
}

T.vartest = function(o) {
  if (typeof o.y === "undefined")
    return j6.chisqtest(o);
  else
    return j6.ftest(o);
}

var z1 = { // 單樣本 Z 檢定
  h:function(o) { return "H0:mu"+o.op+o.mu+" when sd="+o.sd; }, 
  o2q:function(o) {
    var x = o.x, n = x.length;
    var z = (j6.mean(x)-o.mu)/(o.sd/Math.sqrt(n)); // z=(X-mu)/(sd/sqrt(n))
    return j6.pnorm(z, 0, 1);
  },
  q2p:function(q, o) {
    var x = o.x, n = x.length;
    return j6.mean(x) + j6.qnorm(q, 0, 1) * j6.sd(x) / Math.sqrt(n);
  },
  df:function(o) { return o.x.length; }
}

T.ztest = function(o) { 
  o.name = "ztest(X)";
  o.D = z1;
  return T.test(o);
}

var zprop1 = { // 比例的檢定， n 較大時的近似解 o={ x, n, p } // x 為數值，n 個中出現 x 個 1
  h:function(o) { return "H0:p"+o.op+o.p; }, 
  // Z = (p1-p)/sqrt(p(1-p)/n)
  o2q:function(o) {
    var x=o.x, n=o.n, p1=x/n, p=o.p||p1;
    var z = (p1-p)/Math.sqrt(p*(1-p)/n);
    return j6.pnorm(z, 0, 1);
  },
  // 信賴區間公式： p1+z*sqrt(p1*(1-p1)/n)，參考 j6 語言與統計分析 (湯銀才) 149 頁。
  q2p:function(q, o) {
    var x=o.x, n=o.n, p1=x/n, p=p1;
    var z = j6.qnorm(q, 0, 1);
    var z22n = z*z/(2*n);
    return (p1+z22n+z*Math.sqrt( p*(1-p)/n + z22n/(2*n) ))/(1+2*z22n); // j6 的版本，比較複雜的估計公式
//  return p1+z*Math.sqrt(p*(1-p)/n); //  語言與統計分析 (湯銀才) 149 頁的版本。
  },
  df:function(o) { return 1; }
}

var zprop2 = { // 比例的檢定， n 較大時的近似解 o={ x, y, n1, n2 }
  h:function(o) { return "H0:p1-p2"+o.op+o.p; }, 
  // Z = (p1-p2)/sqrt(p*(1-p)*(1/n1+1/n2)), p = (n1p1+n2p2)/(n1+n2)，參考 j6 語言與統計分析 (湯銀才) 175 頁。
  o2q:function(o) {
    var x=o.x, y=o.y, n1=o.n1, n2=o.n2, p1=x/n1, p2=y/n2, p=(n1*p1+n2*p2)/(n1+n2);
    var z = (p1-p2)/Math.sqrt(p*(1-p)*(1/n1+1/n2));
    return j6.pnorm(z, 0, 1);
  },
  // 信賴區間公式： p1-p2+z*sqrt(p*(1-p)*(1/n1+1/n2));
  q2p:function(q, o) {
    var x=o.x, y=o.y, n1=o.n1, n2=o.n2, p1=x/n1, p2=y/n2, p=(n1*p1+n2*p2)/(n1+n2);
    var z = j6.qnorm(q, 0, 1);
    return p1-p2+z*Math.sqrt(p*(1-p)*(1/n1+1/n2));
  },
  df:function(o) { return 1; }
}

/* 在 prop.test.j6 當中，雙邊檢定的 pvalue 是用 pchisq, 單邊才是用 z ，為何呢？ ( 但是信賴區間則是全部用 z)
 if (alternative == "two.sided")
  PVAL <- pchisq(STATISTIC, PARAMETER, lower.tail = FALSE)
    else {
  if (k == 1)
      z <- sign(ESTIMATE - p) * sqrt(STATISTIC)
  else
      z <- sign(DELTA) * sqrt(STATISTIC)
  PVAL <- pnorm(z, lower.tail = (alternative == "less"))
    }
*/

T.proptest = function(o) {
  o.p = o.p || 0.5;
  o.name = "proptest("+j6.str(o)+")";
  o.correct = o.correct|| false;
  if (o.correct) {
    o.name += ", binomtest";
    o.D += binom1;
  } else {
    if (typeof o.y === "undefined") {
      o.name += ", zprop1";
      o.D = zprop1;
    } else {
      o.p = 0; // p1-p2 = 0
      o.name += ", zprop2";
      o.D = zprop2;
    }
  }
  var t=T.test(o);
  if (typeof o.y === "undefined")
    t.p = o.x/o.n;
  else
    t.p = [o.x/o.n1, o.y/o.n2];
  return t;
}

// 參考： https://github.com/SurajGupta/r-source/blob/master/src/library/stats/j6/binom.test.j6
var binom1 = { // 比例的檢定， n 較大時的近似解 o={ x, n, p } // x 為數值，n 個中出現 x 個 1
  h:function(o) { return "H0:p"+o.op+o.p; }, 
  
  // Z = C(n, k)*p1^k*(1-p1)^(n-k), CDF(z: from 1 to x)
  o2q:function(o) {
    var x=o.x, n=o.n, p = o.p, q;
    var dx = j6.dbinom(x, n, p);
    if (o.op === "=") { // 雙尾檢定，去雙尾後 / 2
      var q = 0;
      for (var i=0; i<=n; i++) {
        var di = j6.dbinom(i, n, p);
        if (di > dx+1e-5) q += di; // 為何 x 本身不算，如果算應該用 di > dx-1e-5 才對。
      }
      q=1-((1-q)/2); // 因為 test 會 * 2 所進行的減半調整
    } else { // 單尾檢定
      if (Math.abs(x - n*p)<1e-5) // 正確預測， q=1
        q = 1;
      else {
        if (o.op === ">")
          q = j6.pbinom(x, n, p); // 去右尾
        else // op=== "<"
          q = j6.pbinom(x-1, n, p); // 去右尾
      }
    }
    return q;
  },
/* 注意上述 j6 原始碼另一尾的計算方式，是用 < pbinom(最接近 x 者) 的算法，而不是直接 * 2。 問題是我們在 test 中是直接用*2 的方式。
  d <- dbinom(x, n, p)
  ...
  else if (x < m) {
      i <- seq.int(from = ceiling(m), to = n)
      y <- sum(dbinom(i, n, p) <= d * relErr)
      pbinom(x, n, p) 左尾 + pbinom(n - y, n, p, lower.tail = FALSE) 右尾
  } else {
      i <- seq.int(from = 0, to = floor(m))
      y <- sum(dbinom(i, n, p) <= d * relErr)
      pbinom(y - 1, n, p) 左尾 + pbinom(x - 1, n, p, lower.tail = FALSE) 右尾
  }
*/               
  // 信賴區間公式： P(T>c) = Σ (n, i) C(n, i) p1^i (1-p1)^(n-i) for i>c < q
  
  q2p:function(q, o, side) { 
    var x=o.x, n=o.n, p=o.p, op=o.op;
    if (side === "L")
      return j6.qbeta(q, x, n - x + 1); // 這裏採用 qbeta 是 j6 的作法; 直覺上應該採用 j6.qbinom(q, n, p);
    else
      return j6.qbeta(q, x + 1, n - x);
  },
  df:function(o) { return 1; }
}

T.binomtest = function(o) {
  o.p = o.p || 0.5;
  o.name = "binomtest("+j6.str(o)+")";
  o.D = binom1;
  var t=T.test(o);
  t.p = o.x/o.n;
  t.ci[0]=(o.op === ">")?0:t.ci[0];
  t.ci[1]=(o.op === "<")?1:t.ci[1];
  return t;
}

// anova f-test : array1, array2, array3, ...
T.anovaftest = function() {
  return { 
    h0 : "σ1=σ2=...=σ"+arguments.length, 
    pvalue: J.anovaftest(), 
    score: J.anovafscore(),
  };
}
}
