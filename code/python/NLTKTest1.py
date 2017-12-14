import nltk

print nltk.corpus.gutenberg.files()
'''
count = nltk.defaultdict(int) # initialize a dictionary
for word in nltk.corpus.gutenberg.words('shakespeare-macbeth.txt'): # tokenize Macbeth
    word = word.lower() # normalize to lowercase
    count[word] += 1
print "count=%s"%count
'''

print "nltk.corpus.brown.categories()=", nltk.corpus.brown.categories()
print "nltk.corpus.brown.words(categories=a)", nltk.corpus.brown.words(categories='a')
print "nltk.corpus.brown.sents(categories=a)", nltk.corpus.brown.sents(categories='a')
