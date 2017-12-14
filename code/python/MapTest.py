pos = {}
pos['colorless'] = 'adj'
pos['furiously'] = 'adv'
pos['ideas'] = 'n'

print "pos=", pos
for word in pos:
    print "%s (%s)" % (word, pos[word])

print "pos.keys()=", pos.keys()
print "pos.values()=", pos.values()

print "pos.items()=", pos.items()
for (key, val) in pos.items():
    print "%s ==> %s" % (key, val)


str1 = 'a b c a d b d c d e'
list1 = str1.split(' ')
wordCount1 = {}
print 'list1=', list1
for word in list1:
    if word not in wordCount1:
        wordCount1[word] = 0
    wordCount1[word] += 1
    
print "wordCount1=", wordCount1    

'''The function sorted() is similar to the sort() method on sequences, but rather
than sorting in-place, it produces a new sorted copy of its argument. Moreover,
as we will see very soon, sorted() will work on a wider variety of data types,
including dictionaries.'''

print "sorted(wordCount1.items())=", sorted(wordCount1.items())

sentence = "she sells sea shells by the sea shore".split()
print 'sentence=', sentence
print 'sorted(set(sentence))=', sorted(set(sentence))

