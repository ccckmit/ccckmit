import numpy as np
import matplotlib.pyplot as plt

def createDataSet():
    group = np.array([[1,1],[1,1.5],[0.5,1.5], [5,5], [5,4.5], [4.5,5.5]])
    labels = ['A', 'A', 'A', 'B', 'B', 'B']
    return group, labels

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

plt.show()
