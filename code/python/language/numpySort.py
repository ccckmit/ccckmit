import numpy as np
a = np.array([[1,4],[3,1]])
print('sort(a)\n', np.sort(a))  # sort along the last axis
print('sort(a,axis=None)\n', np.sort(a, axis=None))   # sort the flattened array
print('sort(a, axis=0)\n', np.sort(a, axis=0)) # sort along the first axis

# b = np.array([1, "a"], [2, "b"]) # TypeError: data type not understood
