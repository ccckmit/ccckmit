import numpy as np

def printSVD(U, S, VT):
    print('=========A===========\n', A)
    print('=========U===========\n', U)
    print('=========S===========\n', S)
    print('=========VT==========\n', VT)

def mySVD(A):
    U = A*A.T
    S2, hU = np.linalg.eig(U)
    VT = A.T*A
    return U, np.sqrt(S2), VT

# A = np.mat([[1,2,3], [2,3,1], [3,3,3]])
A = np.mat([[1, 2, 3, 4, 5], [2, 3, 1, 4, 5], [3, 3, 3, 3, 3]])
[m, n] = np.shape(A)
# print('m=', m, 'n=', n)

print('========= linalg.svd(A) =========')
U, S, VT = np.linalg.svd(A)
printSVD(U, S, VT)
myU, myS, myVT = mySVD(A)
print('========= mySVD(A) =========')
printSVD(myU, myS, myVT)

# print('=====np.diag(S, m)=====\n',np.diag(S))
# print('======U*S*VT=========\n', U*np.diag(S)*VT)