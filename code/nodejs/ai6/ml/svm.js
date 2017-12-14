var j6 = require('../../lib/j6')

var x = [[0.4, 0.5, 0.5, 0.,  0.,  0.],
         [0.5, 0.3,  0.5, 0.,  0.,  0.01],
         [0.4, 0.8, 0.5, 0.,  0.1,  0.2],
         [1.4, 0.5, 0.5, 0.,  0.,  0.],
         [1.5, 0.3,  0.5, 0.,  0.,  0.],
         [0., 0.9, 1.5, 0.,  0.,  0.],
         [0., 0.7, 1.5, 0.,  0.,  0.],
         [0.5, 0.1,  0.9, 0.,  -1.8,  0.],
         [0.8, 0.8, 0.5, 0.,  0.,  0.],
         [0.,  0.9,  0.5, 0.3, 0.5, 0.2],
         [0.,  0.,  0.5, 0.4, 0.5, 0.],
         [0.,  0.,  0.5, 0.5, 0.5, 0.],
         [0.3, 0.6, 0.7, 1.7,  1.3, -0.7],
         [0.,  0.,  0.5, 0.3, 0.5, 0.2],
         [0.,  0.,  0.5, 0.4, 0.5, 0.1],
         [0.,  0.,  0.5, 0.5, 0.5, 0.01],
         [0.2, 0.01, 0.5, 0.,  0.,  0.9],
         [0.,  0.,  0.5, 0.3, 0.5, -2.3],
         [0.,  0.,  0.5, 0.4, 0.5, 4],
         [0.,  0.,  0.5, 0.5, 0.5, -2]];

var y =  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1];

var svm = new j6.ML.SVM({
    x : x,
    y : y
});

svm.train({
    C : 1.1, // default : 1.0. C in SVM.
    tol : 1e-5, // default : 1e-4. Higher tolerance --> Higher precision
    max_passes : 20, // default : 20. Higher max_passes --> Higher precision
    alpha_tol : 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision

    kernel : { type: "polynomial", c: 1, d: 5}
    // default : {type : "gaussian", sigma : 1.0}
    // {type : "gaussian", sigma : 0.5}
    // {type : "linear"} // x*y
    // {type : "polynomial", c : 1, d : 8} // (x*y + c)^d
    // Or you can use your own kernel.
    // kernel : function(vecx,vecy) { return dot(vecx,vecy);}
});

console.log("Predict : ",svm.predict([1.3,  1.7,  0.5, 0.5, 1.5, 0.4]));