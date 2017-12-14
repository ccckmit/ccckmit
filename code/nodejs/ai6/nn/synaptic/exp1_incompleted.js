var LSTM = require('./lstm')

var seqText = 'a.b.a+b.a+(a+b).(b+a).(a+b)+a.(a+(b+a))+((a+a)+a).'
LSTM.train(seqText)
var sLines = '.....a.a.a.a.(.(.(.(.(.(a.(a.(a.(b+'.split('.')
LSTM.genLines(sLines)
