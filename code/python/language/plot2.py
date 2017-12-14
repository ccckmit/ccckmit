import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(-5, 5, 200)
y = np.sin(x)
yn = y + np.random.rand(1, len(y))
fig = plt.figure()
ax = fig.add_subplot(111) # 111 代表第一行第一列第一塊, xyz 代表第 x 行 第 y 列 第 z 塊
# 詳細請參考：https://my.oschina.net/iuranus/blog/288196
# 参数349的意思是：将画布分割成3行4列，图像画在从左到右从上到下的第9块
ax.scatter(x, yn, c='blue', marker='o')
ax.plot(x, y+0.75, 'r')
plt.show()
