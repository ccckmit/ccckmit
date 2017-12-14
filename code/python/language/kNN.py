import numpy as np
import matplotlib.pyplot as plt

def createDataSet():
    dataSet = np.array([[0,0], [0,1],[1,0],[1,1], [4,4], [5,4], [4,5], [5,5]])
    labels = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B']
    return dataSet, labels

def euclideanDistance(x,y):
    return np.sqrt((x-y)*(x-y).T)

def kNN(point, dataSet, labels):
    distSet = [euclideanDistance(point, data) for data in dataSet ]
    print('distSet=', distSet)
    sortedSet = distSet
    return sortedSet

dataSet, labels = createDataSet()
fig = plt.figure()
ax = fig.add_subplot(111)
i = 0
for point in dataSet:
    if labels[i] == 'A':
        color = 'red'
    else:
        color = 'blue'
    ax.scatter(point[0], point[1], c=color, marker='o', linewidths=0, s=300)
    plt.annotate('(' + str(point[0]) + ',' + str(point[1]) + ')', xy=(point[0], point[1]))
    i+=1

p = np.mat([1.5, 1.5])
kNN(p, dataSet, labels)

# plt.show()

x = np.mat([1,2])
y = np.mat([3,4])
print('euclideanDistance([1,2],[3,4])=', euclideanDistance(x, y))