from numpy import *
print('op: +*/')
e3 = eye(3)
m33 = ones([3,3])
print('=====e3+m33=====\n', e3+m33)
print("====e3-m33======\n", e3-m33)
print("====10*e3======\n", 10*e3)
print("====(3*e3)^2======\n", power(3*e3, 2))

print('transpose , row operation')
m23 = mat([[1,2,3], [4,5,6]])
m22 = m23 * m23.T
print("==== m23 ======\n", m23)
print("==== m23.T ======\n", m23.T)
print("== m22=m23*m23.T ===\n", m22)
print("sum(m23) = ", sum(m22))
print("m23.shape=", m23.shape)
print("m23[0]=", m23[0])
print("m23.T[0]=", m23.T[0])

print('random >> ')
r23 = random.random((2,3))
print("==== r23 ======\n", r23)

