var Tensor = require('adnn/tensor');

// Create a rank-1 tensor (i.e. a vector)
var vec = new Tensor([3]);  // vec is a 3-D vector
// Fill vec with the contents of an array
vec.fromArray([1, 2, 3]);
// Return the contents of vec as an array
vec.toArray();  // returns [1, 2, 3]
// Fill vec with a given value
vec.fill(1);    // vec is now [1, 1, 1]
// Fill vec with random values
vec.fillRandom();
// Create a copy of vec
var dupvec = vec.clone();

// Create a rank-2 tensor (i.e. a matrix)
var mat = new Tensor([2, 2]);  // mat is a 2x2 matrix
// Fill mat with the contents of an array
mat.fromArray([[1, 2], [3, 4]]);
// Can also use a flattened array
mat.fromFlatArray([1, 2, 3, 4]);
// Retrieve an individual element of mat
var elem = mat.get([0, 1]);   // elem = 2
// Set an individual element of mat
mat.set([0, 1], 5);   // mat is now [[1, 5], [3, 4]]