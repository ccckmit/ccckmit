import numpy as np

A = np.mat([[1,2,3], [4,5,6], [7, 0, 8 ]])
print("A=", A)
print("det(A)=", np.linalg.det(A))
print("inv(A)=", np.linalg.inv(A))
print("rank(A)=", np.linalg.matrix_rank(A))
b = np.array([1,1,1])
print("b=", b)
S = np.linalg.solve(A, b)
print("S = solve(A,b) =", S)


