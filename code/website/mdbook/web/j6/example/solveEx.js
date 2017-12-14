var R = require("../j6");

// ODE (ordinary differential equation) : dopri() is an implementation of the Dormand-Prince-Runge-Kutta integrator with adaptive time-stepping
// https://en.wikipedia.org/wiki/Dormand%E2%80%93Prince_method
var ode = R.ode(0,1,1,(t,y)=>y);
print('ode(0,1,1,(t,y)=>y)=', ode);
print('at([0.3,0.7])=', ode.at(0.3,0.7));

// linear programming
print('LP:', R.solveLP([1,1],                   /* minimize [1,1]*x                */
                [[-1,0],[0,-1],[-1,-2]], /* matrix of inequalities          */
                [0,0,-3])                /* right-hand-side of inequalities */
    );

// Unconstrained minimization
var sqr = (x)=>x*x;
print('minimize(...) =', R.minimize((x)=>sqr(10*(x[1]-x[0]*x[0]))+sqr(1-x[0]),[-1.2,1])); 