G.chart2D('#chart1', function(g) {
  dt = R.dt;
  G.curve(g, "dt(3)" , (x)=>dt(x,3) );
  G.curve(g, "dt(10)", (x)=>dt(x,10));
  G.curve(g, "dt(25)", (x)=>dt(x,25));
});

G.chart2D('#chart2', function(g) {
  var x = R.rnorm(10000, 3, 2);
  G.hist(g, "x", x, 'bar', -10, 10, 0.3);
//  G.curve(g, "N(5,2)", (x)=>R.dnorm(x, 3, 2)*1000);
});

G.chart2D('#chart3', function(g) {
  Ax = R.rnorm(100, 10, 1);
  Ay = R.rnorm(100, 0, 0.5);
  Bx = R.rnorm(100, 0, 1);
  By = R.rnorm(100, 0, 0.5);
  G.plot(g, "A", Ax, Ay);
  G.plot(g, "B", Bx, By);
});

function hist(g,name,x,k) {
	var mk = x.fillVM(k,x.length/k);
	var xbar = mk.colSum();
  G.ihist(g, name, xbar, 'bar');
}

var x = R.samples([0,1], 100000, {replace:true});
G.chart2D('#chart4', (g)=>hist(g,'x1bar',  x,1));
G.chart2D('#chart5', (g)=>hist(g,'x2bar',  x,2));
G.chart2D('#chart6', (g)=>hist(g,'x10bar', x,10));
G.chart2D('#chart7', (g)=>G.pie(g, {A:30, B:40, C:20, D:10}));
G.chart2D('#chart8', (g)=>G.timeSeries(g, [
  ['x','2013-01-01','2013-01-02','2013-01-03','2013-01-04','2013-01-05'],
  ['data1',      30,         200,         100,         400,         150],
  ['data2',     130,         340,         200,         500,         250]
]));

G.chart3D('#chart9', 'surface', function(x, y) { 
  return (Math.sin(x/50) * Math.cos(y/50) * 50 + 50); 
});
