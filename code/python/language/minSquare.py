import numpy as np
import matplotlib.pyplot as plt

def plotScatter(X, Y, a, b):
    print('X=', X)
    print('Y=', Y)
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.scatter(X, Y, c='blue', marker='o') # 這行有錯 Masked arrays must be 1-D
    X.sort()
    yh = [a*float(xi)+b for xi in X]
    print('yh=', yh)
    plt.plot(X, yh, 'r')
    return yh

def minSquare(X, Y):
    meanX = np.mean(X)
    meanY = np.mean(Y)
    dX = X - meanX
    dY = Y - meanY
    dotXY = np.vdot(dY, dY)
    sqX = sum(np.power(dX, 2))
    a = dotXY/sqX
    b = meanY - a*meanX
    return a, b

X = [1.1, 2.0, 3.05, 3.87, 5.02]
Y = [3.01,4.0, 4.95, 6.01, 6.96] # Y ~ 1 X + 2

print(X)
print(Y)

[a,b] = minSquare(X, Y)

plotScatter(X,Y,a,b)
plt.show()
