import numpy as np
v = [1,2,3,4,5]
c = 10
a = np.array(v)
b = np.array([2,2,2,2,2])
print('c=', c)
print('a=', a)
print('b=', b)
print('c*a=', c*a)
print('sqrt(a)=', np.sqrt(a))
print('sin(a)=', np.sin(a))
print('a+b=', a+b)
print('a-b=', a-b)
print('a*b=', a*b)
print('a/b=', a/b)
print('a**b=', a**b)
print('dot(a,b)=', np.dot(a,b))

m34 = np.arange(12).reshape(3, 4)
print('m34=', m34)
print(m34.shape)    #(3, 4)
print(m34.ndim)     #2
print(m34.dtype.name)  #'int32'
print(m34.itemsize)    #8 一個浮點數佔8byte
print(m34.size)        #12
print(type(m34))       #<type 'numpy.ndarray'>

m234 = np.ones((2,3,4),dtype=np.int16)
print('m234=', m234)

r1 = np.arange(0, 1, 0.1)
print('r1=arange(0, 1, 0.1)=', r1)

r2 = np.linspace(0, 2, 11)
print('r2=linspace(0, 2, 11)=', r2)

# print('m[0][0]=', m[0][0])