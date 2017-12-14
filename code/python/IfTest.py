# -*- coding: cp950 -*-
word = "cat"
if len(word) >= 5:
    print 'word length is greater than 5'
else:
    print 'word length is less than 5'

if len(word) < 3:
    print 'word length is less than three'
elif len(word) == 3:
    print 'word length is equal to three'
else:
    print 'word length is greater than three'
    
# It's worth noting that in the condition part of an if statement,
# a nonempty string or list is evaluatedas true, while an empty
# string or list evaluates as false.
mixed = ['cat', '', ['dog'], []]
for element in mixed:
    if element:
        print element

print '你好'

sentence = 'how now brown cow'
print 'sentence.split()=', sentence.split()

words = sentence.split()
for word in words:
    if word.endswith('ow'):
        print word

# A Taster of Data Types
oddments = ['cat', 'cat'.index('a'), 'cat'.split()]
for e in oddments:
    print 'type(', e, ')=', type(e)

print 'Hi*3=', 'Hi' * 3

