# String Function Demo
msg = 'Hello World'
print 'msg=', msg
print 'msg[3]=', msg[3]
print 'len(msg)=', len(msg)
print 'msg[1:4]=', msg[1:4]
print 'msg[0:11]=', msg[0:11]
print 'msg[0:-6]=', msg[0:-6]
print 'msg[:3]=', msg[:3]
print 'msg[6:]=', msg[6:]
print 'step2 : msg[6:11:2]=', msg[6:11:2]
print 'step-2: msg[10:5:-2]=', msg[10:5:-2]
s1 = 'colorless green ideas sleep furiously'
print 's1=', s1
print 's1[16:21]=', s1[16:21]
print 'len(s1)=', len(s1)

# List Function Demo
squares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
print 'squares=', squares
shopping_list = ['juice', 'muffins', 'bleach', 'shampoo']
print 'shoppint_list=', shopping_list
cgi = ['colorless', 'green', 'ideas']
print 'cgi=', cgi
print 'len(cgi)=', len(cgi)
print 'cgi[0]=', cgi[0]
print 'cgi[-1]=', cgi[-1]
print 'cgi[1:3]=', cgi[1:3]
print 'cgi + [sleep, furiously]=', cgi+['sleep', 'furiously']
cgi.reverse()
print 'cgi.reverse()'
print 'cgi=', cgi
cgi.sort()
print 'cgi.sort()'
print 'cgi=', cgi
cgi.append('sleep')
print 'cgi.append(said)'
print 'cgi=', cgi
print 'cgi.index(green)=', cgi.index('green')
cgi.append(['a', 'b', 'c'])
print 'cgi.append([a, b, c])'
print 'cgi=', cgi

# for loop demo
for num in [1, 2, 3]:
    print 'The number is', num

sent = 'colorless green ideas sleep furiously'
for char in sent:
    print char,
print

#String Formatting
for word in cgi:
    print word, '(', len(word), '),',
print

print "I want a %s right now" % "coffee"
print "%s wants a %s %s" % ("Lee", "sandwich", "for lunch")

for word in cgi:
    print "%s (%d)," % (word, len(word)),
print

for word in cgi:
    print "Word = %s\nIndex = %s\n*****" % (word, cgi.index(word))
print

cgi[4] = 'furiously'

s = ''
for word in cgi:
    s += ' ' + word

print 's=', s

chomsky = cgi
print '_.join(chomsky)=', '_'.join(chomsky)

import string
print 'string.join(chomsky)=', string.join(chomsky)
print 'string.join(chomsky,;)=', string.join(chomsky,';')

