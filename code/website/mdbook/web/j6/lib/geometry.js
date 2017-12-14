module.exports = function (j6) {
var extend = j6.extend;
// j6 = j6.j6 = j6.Geometry = {}

// 各種 space : https://en.wikipedia.org/wiki/Space_(mathematics)#/media/File:Mathematical_implication_diagram_eng.jpg

// Space = HllbertSpace + BanachSpace + Manifold (流形)
j6.Space = extend({}, j6.Set);

// ============= Topology ====================
// https://en.wikipedia.org/wiki/Topological_space
// p : point
j6.TopologicalSpace={ // 拓撲空間 : a Space with neighbor()
	neighbor:function(p1, p2) {}, // TopologicalSpace is a Space with neighbor() function.
  coarser:function(T1, T2) {}, // 更粗糙的 (coarser, weaker or smaller) 的拓樸
	finer:function(T1, T2) { return !courser(T2,T1) }, // 更細緻的 (finer, stronger or larger) 的拓樸
	continuous:function() {}, // if for all x in X and all neighbourhoods N of f(x) there is a neighbourhood M of x such that f(M) is subset of N.
	homeomorphism:function() {}, // 同胚: 同胚是拓撲空間範疇中的同構(存在 f 雙射，連續，且 f-1 也連續) (注意和代數的 Homomorphism (同態) 不同，差一個 e)
}

extend(j6.TopologicalSpace, j6.Space);

// Kolmogorov classification T0, T1, T2, ....
// https://en.wikipedia.org/wiki/Separation_axiom

j6.T0 = j6.KolmogorovSpace = {
// every pair of distinct points of X, at least one of them has a neighborhood not containing the other	
}

extend(j6.T0, j6.TopologicalSpace);

j6.T1 = j6.FrechetSpace = {}

// 任兩點都可鄰域分離者，為郝斯多夫空間。
j6.T2 = j6.HausdorffSpace = {}

j6.T2Complete = {}

j6.T2p5	= j6.Urysohn = {} // T2?

j6.T3 = j6.RegularSpace = {
	// every closed subset C of X and a point p not contained in C admit non-overlapping open neighborhoods
}

j6.T3p5	= j6.TychonoffSpace = {} // T3?

j6.T4 = j6.NormalHausdorff = {}

j6.T5 = j6.CompletelyNormalHausdorff = {}

j6.T6 = j6.PerfectlyNormalHausdorff = {}

// https://en.wikipedia.org/wiki/Discrete_space
j6.DiscreteSpace = {} // 

extend(j6.DiscreteSpace, j6.TopologicalSpace);

// 1. d(x,y)>=0, 2. d(x,y)=0 iff x=y 3. d(x,y)=d(y,x) 4. d(x,z)<=d(x,y)+d(y,z)
j6.Metric = {
	d:function(x,y) {}, 
	test0:function() {
		be(d(x,y)>=0);
		be(d(x,x)==0);
		be(d(x,y)==d(y,x));
	},
	test:function() {
		test0();
		be(d(x,z)<=d(x,y)+d(y,z));
	},
}

j6.UltraMetric = {
	test:function() {
		test0();
		be(d(x,z)<=max(d(x,y),d(y,z)));
	},
}

extend(j6.UltraMetric, j6.Metric);

// https://en.wikipedia.org/wiki/Metric_space
j6.MetricSpace = { // distances between all members are defined
	d:function(p1,p2) {},
	test:function() {
		be(d(x,y)>=0);
		be(d(x,x)===0);
		be(d(x,y)===d(y,x));
		be(d(x,z)<=d(x,y)+d(y,z));
	}
}

j6.CompleteMetricSpace = { // 空間中的任何柯西序列都收斂在該空間之內。
}

extend(j6.CompleteMetricSpace, j6.MetricSpace);

// https://en.wikipedia.org/wiki/Complete_metric_space
j6.CompleteMetricSpace = {
	// M is called complete (or a Cauchy space) if every Cauchy sequence of points in M has a limit that is also in M or, alternatively, if every Cauchy sequence in M converges in M.
}

// https://en.wikipedia.org/wiki/Uniform_space
j6.UniformSpace = { // 帶有一致結構的集合，「x 鄰近於a 勝過y 鄰近於b」之類的概念，在均勻空間中是有意義的。
	
}

j6.Rn = {
	
} // (j6,j6,....)

// 向量空間： VectorSpace = Rn + Linearity
// V:AbelGroup(交換群), F:Field
// 1. F × V → V，(r,v)→ rv
// 2. r(x+y) = rx+ry
// 3. (r+s)x = rx+sx
// 4. (rs)x = r(sx)
// 5. 1x = x
j6.VectorSpace = j6.LinearSpace = {
	add(x,y) { return x.add(y) },
	mul(a,x) { return a.mul(x) },
	bilinear(b) { // https://en.wikipedia.org/wiki/Bilinear_form
		linear((u)=>b(u,w));
		linear((w)=>b(u,w));
	},
	positiveDefinite(b) { }, // 正定
	symmetric(b) {}, // 對稱
	dualSpace() {}, // https://en.wikipedia.org/wiki/Dual_space
}

extend(j6.VectorSpace, j6.Rn);

j6.FiniteVectorSpace = {} // 有限體向量空間

extend(j6.FiniteVectorSpace, j6.VectorSpace);

j6.NormedVectorSpace={ // 賦範空間
	norm:function(v) { return x.norm() },
}

extend(j6.NormedVectorSpace, j6.VectorSpace);

j6.InnerProductSpace={ // 內積空間
	dot(x,y) { return x.vdot(y) },
}

extend(j6.InnerProductSpace, j6.NormedVectorSpace);

// 仿射空間：a1 v1 + ... + an vn 中 sum(ai)=1
// https://en.wikipedia.org/wiki/Affine_space
j6.AffineSpace = {
	sub(x,y) { }, // 點與點的差是一向量
	add(x,v) { }, // 點加向量得一點，但點與點不可作加法
}

// ============= Euclidean Geometry 歐氏幾何 ====================
j6.EuclideanSpace = {
	d(x,y) { return x.sub(y).norm() }, // v= x.sub(y); v.dot(v).sqrt()
	dot(x,y) { return x.vdot(y) },
}

j6.LocallyConvaxSpace={}
extend(j6.LocallyConvaxSpace, j6.VectorSpace);

j6.HilbertSpace={} // HilbertSpace => InnerProductSpace => LocallyConvaxSpace => VectorSpace (LinearSpace)
extend(j6.HilbertSpace, j6.InnerProductSpace);

// BanachSpace => NormedVectorSpace => MetricSpace => TopologicalSpace
// NormedVectorSpace that Cauchy sequence of vectors always converges to a well defined limit
j6.BanachSpace={}

extend(j6.BanachSpace, j6.NormedVectorSpace);

j6.MeasureSpace = {} // 測度空間 M(Set) => j6

j6.ProbabilitySpace = {} // 機率空間 M(Set) = 1/3


// ============= Elliptic Geometry 橢圓幾何 ====================
j6.EllipticGeometry = {} // 橢圓幾何

j6.SphericalGeometry = {} // 球面幾何

j6.SphericalTrigonometry = {} // 球面三角學

j6.Geodesy = {} // 大地測量學

j6.GreatCircleDistance = {} // 大球距離

// 圓： x^2+y^2 = 1 =>  (x,y)=(sin t, cos t)
// 雙曲線： x^2-y^2 = 1 => (x,y) = (sinh t, cosh t)
// sinh = (e^x-e^{-x})/2, cosh = (e^x+e^{-x})/2
// https://en.wikipedia.org/wiki/Hyperbolic_function
// sinh x = -i sin ix ; cosh x = cos ix
// sin x  泰勒展開 = x - 1/3! x^3 + 1/5! x^5 ....
// sinh x 泰勒展開 = x + 1/3! x^3 + 1/5! x^5 ....
// int sinh cx dx = 1/c cosh cx + C 
  

// ============= Hyperbolic Geometry 雙曲幾何 ====================
j6.HyperbolicGeometry = {}

// ============= Riemannian Geometry ====================
// https://en.wikipedia.org/wiki/Riemannian_geometry
j6.RiemannianGeometry = {} // 黎曼幾何

j6.RiemannianMetrics = {} // 黎曼度規

j6.MetricTensor = {} // 度規張量

j6.GaussBonnetTheorem = {} // 高斯博內定理

// ============= Manifold : 流形 ====================
j6.Manifold={}

j6.C0 = {}

j6.Coo = {}

// https://en.wikipedia.org/wiki/Topological_vector_space
j6.TopologicalVectorSpace = {}  

// https://en.wikipedia.org/wiki/Locally_convex_topological_vector_space
j6.LocallyConvexSpace = {}

extend(j6.LocallyConvexSpace, j6.TopologicalVectorSpace);
extend(j6.LocallyConvexSpace, j6.NormedVectorSpace);

// m 維拓撲流形
j6.TopologicalManifold={
// M是豪斯多夫空間，x in M 有鄰域 U 同胚於 m 維歐幾里得空間 j6^{m}的一個開集
}

j6.BanachManifold = {}

// =========== Topological Ring ==============
j6.TopologicalRing = extend({}, j6.Ring);
j6.TopologicalField = extend({}, j6.Field);

// ref : https://en.wikipedia.org/wiki/Group_homomorphism
//  https://en.wikipedia.org/wiki/Fundamental_theorem_on_homomorphisms
// 同態：h(a • b) = h(a) x h(b) 
j6.homomorphism=function(h, g1, g2) {
  var a=g1.random(), b=g2.random();
  return eq(h(group1.op(a,b)), group2.op(h(a), h(b)))
}

// ref : https://en.wikipedia.org/wiki/Isomorphism
//  https://en.wikipedia.org/wiki/Isomorphism_theorem
// 同構：h(a • b) = h(a) • h(b)
j6.isomorphism=function(h1, h2, g1, g2) {
  var a1=g1.random(), b1=g2.random();
  var a2=g1.random(), b2=g2.random();
  return homorphism(h1,g1,g2)&&homorphism(h2,g2,g1);
}


// 多邊形：Polygon
// 多面體：Polyhedron : V-E+F = 2
// 多胞形：Polytope
// ============= Spherical Geometry ====================
j6.SphericalGeometry = {}

j6.MandelbrotSet = {}
/*
For each pixel (Px, Py) on the screen, do:
{
  x0 = scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
  y0 = scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
  x = 0.0
  y = 0.0
  iteration = 0
  max_iteration = 1000
  // Here N=2^8 is chosen as a reasonable bailout radius.
  while ( x*x + y*y < (1 << 16)  AND  iteration < max_iteration ) {
    xtemp = x*x - y*y + x0
    y = 2*x*y + y0
    x = xtemp
    iteration = iteration + 1
  }
  // Used to avoid floating point issues with points inside the set.
  if ( iteration < max_iteration ) {
    // sqrt of inner term removed using log simplification rules.
    log_zn = log( x*x + y*y ) / 2
    nu = log( log_zn / log(2) ) / log(2)
    // Rearranging the potential function.
    // Dividing log_zn by log(2) instead of log(N = 1<<8)
    // because we want the entire palette to range from the
    // center to radius 2, NOT our bailout radius.
    iteration = iteration + 1 - nu
  }
  color1 = palette[floor(iteration)]
  color2 = palette[floor(iteration) + 1]
  // iteration % 1 = fractional part of iteration.
  color = linear_interpolate(color1, color2, iteration % 1)
  plot(Px, Py, color)
}
*/


// 碎形幾何 : Fractal
// http://andrew-hoyer.com/
// http://andrew-hoyer.com/experiments/fractals/
// http://flam3.com/flame.pdf
// https://en.wikipedia.org/wiki/List_of_fractals_by_Hausdorff_dimension

// http://rembound.com/articles/drawing-mandelbrot-fractals-with-html5-canvas-and-javascript
// https://github.com/rembound/Mandelbrot-Fractal-HTML5/blob/master/mandelbrot-fractal.js


// 操控繪圖
// http://fabricjs.com/ (讚！)
// https://github.com/kangax/fabric.js

// 3D 動畫
// https://threejs.org/
// http://haptic-data.com/toxiclibsjs/

// 地理資訊
// ArcGIS : https://developers.arcgis.com/javascript/3/

// 動畫
// http://paperjs.org/features/
// https://processing.org/

// 向量
// http://victorjs.org/
// 3d: https://evanw.github.io/lightgl.js/docs/vector.html
}