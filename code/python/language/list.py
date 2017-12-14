mylist = [1,2,3,4,5]
length = len(mylist)
a = 10
for indx in range(length):
    mylist[indx] = a * mylist[indx]
print(mylist)

score = [70, 90, 81, 66]
name  = ['a', 'b', 'c', 'd']
scoreMap = zip(name, score)
print('score=', score)
print('name=', name)
print('scoreMap=', list(scoreMap))

print('sorted(scoreMap)=', sorted(scoreMap))

students = [
        ('ccc', 'A', 73),
        ('snoopy', 'B', 90),
        ('johnson', 'B', 82),
]

sortedStudents = sorted(students, key = lambda x : x[2])   # sort by score
print('sortStudents = ', sortedStudents)

