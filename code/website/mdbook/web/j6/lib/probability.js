module.exports = function (j6) {
/* eslint-disable no-undef */
var J = require('jStat').jStat
var ncall = j6.ncall

// ========== 離散分佈的 r, q 函數 ============
j6.qcdf = function (cdf, q, N, p) {
  for (var i = 0; i <= N; i++) {
    if (cdf(i, N, p) > q) return i
  }
  return N
}

j6.rcdf = function (cdf, n, N, p) {
  var a = []
  for (var i = 0; i < n; i++) {
    var q = Math.random()
    a.push(cdf(q, N, p))
  }
  return a
}

j6.EPSILON = 0.0000000001
// 均等分布 : Uniform Distribution(a,b)    1/(b-a)
j6.dunif = function (x, a = 0, b = 1) { return (x >= a && x <= b) ? 1 / (b - a) : 0 }
j6.punif = function (x, a = 0, b = 1) { return (x >= b) ? 1 : (x <= a) ? 0 : (x - a) / (b - a) }
j6.qunif = function (p, a = 0, b = 1) { return (p >= 1) ? b : (p <= 0) ? a : a + (p * (b - a)) }
j6.runif1 = function (a = 0, b = 1) { return j6.random(a, b) }
j6.runif = function (n, a = 0, b = 1) { return ncall(n, j6, 'random', a, b) }
/*
j6.dunif=(x,a=0,b=1)=>J.uniform.pdf(x,a,b);
j6.punif=(q,a=0,b=1)=>J.uniform.cdf(q,a,b);
j6.qunif=(p,a=0,b=1)=>J.uniform.inv(p,a,b);
j6.runif=(n,a=0,b=1)=>ncall(n, J.uniform, 'sample', a, b);
*/
// 常態分布 : jStat.normal( mean, sd )
j6.dnorm = (x, mean = 0, sd = 1) => J.normal.pdf(x, mean, sd)
j6.pnorm = (q, mean = 0, sd = 1) => J.normal.cdf(q, mean, sd)
j6.qnorm = (p, mean = 0, sd = 1) => J.normal.inv(p, mean, sd)
j6.rnorm1 = function () { // generate random guassian distribution number. (mean : 0, standard deviation : 1)
  var v1, v2, s
  do {
    v1 = (2 * Math.random()) - 1   // -1.0 ~ 1.0 ??? ?
    v2 = (2 * Math.random()) - 1   // -1.0 ~ 1.0 ??? ?
    s = (v1 * v1) + (v2 * v2)
  } while (s >= 1 || s === 0)

  s = Math.sqrt((-2 * Math.log(s)) / s)
  return v1 * s
}

j6.rnorm = (n, mean = 0, sd = 1) => ncall(n, J.normal, 'sample', mean, sd)
// F 分布 : jStat.centralF( df1, df2 )
j6.df = (x, df1, df2) => J.centralF.pdf(x, df1, df2)
j6.pf = (q, df1, df2) => J.centralF.cdf(q, df1, df2)
j6.qf = (p, df1, df2) => J.centralF.inv(p, df1, df2)
j6.rf = (n, df1, df2) => ncall(n, J.centralF, 'sample', df1, df2)
// T 分布 : jStat.studentt( dof )
j6.dt = (x, dof) => J.studentt.pdf(x, dof)
j6.pt = (q, dof) => J.studentt.cdf(q, dof)
j6.qt = (p, dof) => J.studentt.inv(p, dof)
j6.rt = (n, dof) => ncall(n, J.studentt, 'sample', dof)
// Beta 分布 : jStat.beta( alpha, beta )
j6.dbeta = (x, alpha, beta) => J.beta.pdf(x, alpha, beta)
j6.pbeta = (q, alpha, beta) => J.beta.cdf(q, alpha, beta)
j6.qbeta = (p, alpha, beta) => J.beta.inv(p, alpha, beta)
j6.rbeta = (n, alpha, beta) => ncalls(n, J.beta, 'sample', alpha, beta)
// 柯西分布 : jStat.cauchy( local, scale )
j6.dcauchy = (x, local, scale) => J.cauchy.pdf(x, local, scale)
j6.pcauchy = (q, local, scale) => J.cauchy.cdf(q, local, scale)
j6.qcauchy = (p, local, scale) => J.cauchy.inv(q, local, scale)
j6.rcauchy = (n, local, scale) => ncall(n, J.cauchy, 'sample', local, scale)
// chisquare 分布 : jStat.chisquare( dof )
j6.dchisq = (x, dof) => J.chisquare.pdf(x, dof)
j6.pchisq = (q, dof) => J.chisquare.cdf(q, dof)
j6.qchisq = (p, dof) => J.chisquare.inv(p, dof)
j6.rchisq = (n, dof) => ncall(n, J.chisquare, 'sample', dof)
// 指數分布 : Exponential Distribution(b)  1/b e^{-x/b}
j6.dexp = function (x, rate) { return rate * Math.exp(-rate * x) }
j6.pexp = function (x, rate) { return x < 0 ? 0 : 1 - Math.exp(-rate * x) }
j6.qexp = function (p, rate) { return -Math.log(1 - p) / rate }
j6.rexp1 = function (rate) { return j6.qexp(j6.random(0, 1), rate) }
j6.rexp = function (n, rate) { return ncall(n, j6, 'rexp1', rate) }
/*
j6.dexp=(x,rate)=>J.exponential.pdf(x,rate);
j6.pexp=(q,rate)=>J.exponential.cdf(q,rate);
j6.qexp=(p,rate)=>J.exponential.inv(p,rate);
j6.rexp=(n,rate)=>ncall(n, J.exponential, 'sample', rate);
*/
// Gamma 分布 : jStat.gamma( shape, scale )
j6.dgamma = (x, shape, scale) => J.gamma.pdf(x, shape, scale)
j6.pgamma = (q, shape, scale) => J.gamma.cdf(q, shape, scale)
j6.qgamma = (p, shape, scale) => J.gamma.inv(p, shape, scale)
j6.rgamma = (n, shape, scale) => ncall(n, J.gamma, 'sample', shape, scale)
// 反 Gamma 分布 : jStat.invgamma( shape, scale )
j6.rinvgamma = (n, shape, scale) => ncall(n, J.invgamma, 'sample', shape, scale)
j6.dinvgamma = (x, shape, scale) => J.invgamma.pdf(x, shape, scale)
j6.pinvgamma = (q, shape, scale) => J.invgamma.cdf(q, shape, scale)
j6.qinvgamma = (p, shape, scale) => J.invgamma.inv(p, shape, scale)
// 對數常態分布 : jStat.lognormal( mu, sigma )
j6.dlognormal = (n, mu, sigma) => J.lognormal.pdf(x, sigma)
j6.plognormal = (n, mu, sigma) => J.lognormal.cdf(q, sigma)
j6.qlognormal = (n, mu, sigma) => J.lognormal.inv(p, sigma)
j6.rlognormal = (n, mu, sigma) => ncall(n, J.dlognormal, 'sample', mu, sigma)
// Pareto 分布 : jStat.pareto( scale, shape )
j6.dpareto = (n, scale, shape) => J.pareto.pdf(x, scale, shape)
j6.ppareto = (n, scale, shape) => J.pareto.cdf(q, scale, shape)
j6.qpareto = (n, scale, shape) => J.pareto.inv(p, scale, shape)
j6.rpareto = (n, scale, shape) => ncall(n, J.pareto, 'sample', scale, shape)
// Weibull 分布 jStat.weibull(scale, shape)
j6.dweibull = (n, scale, shape) => J.weibull.pdf(x, scale, shape)
j6.pweibull = (n, scale, shape) => J.weibull.cdf(q, scale, shape)
j6.qweibull = (n, scale, shape) => J.weibull.inv(p, scale, shape)
j6.rweibull = (n, scale, shape) => ncall(n, J.weibull, 'sample', scale, shape)
// 三角分布 : jStat.triangular(a, b, c)
j6.dtriangular = (n, a, b, c) => J.triangular.pdf(x, a, b, c)
j6.ptriangular = (n, a, b, c) => J.triangular.cdf(q, a, b, c)
j6.qtriangular = (n, a, b, c) => J.triangular.inv(p, a, b, c)
j6.rtriangular = (n, a, b, c) => ncall(n, J.triangular, 'sample', a, b, c)
// 類似 Beta 分布，但計算更簡單 : jStat.kumaraswamy(alpha, beta)
j6.dkumaraswamy = (n, alpha, beta) => J.kumaraswamy.pdf(x, alpha, beta)
j6.pkumaraswamy = (n, alpha, beta) => J.kumaraswamy.cdf(q, alpha, beta)
j6.qkumaraswamy = (n, alpha, beta) => J.kumaraswamy.inv(p, alpha, beta)
j6.rkumaraswamy = (n, alpha, beta) => ncalls(n, J.kumaraswamy, 'sample', alpha, beta)

// ========== 離散分佈的 r, q 函數 ============
// 二項分布 : jStat.binomial(n, p0)
j6.dbinom = (x, size, prob) => J.binomial.pdf(x, size, prob)
j6.pbinom = (q, size, prob) => J.binomial.cdf(q, size, prob)
j6.qbinom = (p, size, prob) => j6.qcdf(j6.pbinom, p, size, prob)
j6.rbinom = (n, size, prob) => j6.rcdf(j6.qbinom, n, size, prob)
// 負二項分布 : jStat.negbin(r, p)
j6.dnbinom = (x, size, prob) => J.negbin.pdf(x, size, prob)
j6.pnbinom = (q, size, prob) => J.negbin.cdf(q, size, prob)
j6.qnbinom = (p, size, prob) => j6.qcdf(j6.pnbinom, p, size, prob)
j6.rnbinom = (n, size, prob) => j6.rcdf(j6.qnbinom, n, size, prob)
// 超幾何分布 : jStat.hypgeom(N, m, n)
j6.dhyper = (x, m, n, k) => J.hypgeom.pdf(k, m, n, k)
j6.phyper = (q, m, n, k) => J.hypgeom.cdf(q, m, n, k)
j6.qhyper = (p, m, n, k) => j6.qcdf(j6.phyper, p, m, n, k)
j6.rhyper = (nn, m, n, k) => j6.rcdf(j6.qhyper, nn, m, n, k)
// 布瓦松分布 : jStat.poisson(l)
j6.dpois = (x, lambda) => J.poisson.pdf(x, lambda)
j6.ppois = (q, lambda) => J.poisson.cdf(q, lambda)
j6.qpois = (p, lambda) => j6.qcdf(j6.ppois, p, lambda)
j6.rpois = (n, lambda) => j6.rcdf(j6.qpois, n, lambda)
}