import nltk.data
path = nltk.data.find('samples/polish-lat2.txt')
import codecs
f = codecs.open(path, encoding='latin2')
lines = f.readlines()
for l in lines:
    l = l[:-1]
    uni = l.encode('unicode_escape')
    print uni

print ord('a')
print u'\u0061'
nacute = u'\u0144'
print nacute
nacute_utf = nacute.encode('utf8')
print repr(nacute_utf)

import unicodedata
line = lines[2]
print line.encode('unicode_escape')
for c in line:
    if ord(c) > 127:
        print '%r U+%04x %s' % (c.encode('utf8'), ord(c), unicodedata.name(c))

print line.find(u'zosta\u0142y')
line = line.lower()

import re
print line.encode('unicode_escape')
m = re.search(u'\u015b\w*', line)
print m.group()

from nltk.tokenize import WordTokenizer
tokenizer = WordTokenizer()
print tokenizer.tokenize(line)

path = nltk.data.find('samples/sinorama-gb.xml')
f = codecs.open(path, encoding='gb2312')
lines = f.readlines()
for l in lines:
    l = l[:-1]
    utf_enc = l.encode('utf8')
    print repr(utf_enc)

path = nltk.data.find('samples/sinorama-utf8.xml')
from nltk.etree import ElementTree as ET
tree = ET.parse(path)
text = tree.findtext('sent')
uni_text = text.encode('utf8')
print repr(uni_text.splitlines()[1])
print "text=", text
