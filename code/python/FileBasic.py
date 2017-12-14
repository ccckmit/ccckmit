import os
os.listdir('.')
f = open('corpus.txt', 'rU')
print f.read()

text = open('corpus.txt', 'rU').read()
print text

f = open('corpus.txt', 'rU')
for line in f:
    print line[:-1]

from urllib import urlopen
page = urlopen("http://news.bbc.co.uk/").read()
print page[:60]

import re
line = '<title>BBC NEWS | News Front Page</title>'
new = re.sub('<.*>', '', line)
print "new=%s"%new

page = re.sub('<.*?>', '', page)
page = re.sub('\s+', ' ', page)
print "page=%s"%page[:60]

