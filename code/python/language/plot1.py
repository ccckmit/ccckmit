from numpy import *
import matplotlib.pyplot as plt
dataSet = [[1,2], [3,4]]
dataMat = mat(dataSet).T
plt.scatter(dataSet[0], dataSet[1], c='red', marker='o')
X = linspace(-2,2,100)
Y=2.8*X+9
plt.plot(X,Y)
plt.show()