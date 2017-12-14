# -*- coding: cp950 -*-
import nltk
def vocab_growth(texts):
    vocabulary = set()
    for text in texts:
        for word in text:
            vocabulary.add(word)
            yield len(vocabulary)

def speeches():
    presidents = []
    texts = nltk.defaultdict(list)
    for speech in nltk.corpus.state_union.files():
        president = speech.split('-')[1]
        if president not in texts:
            presidents.append(president)
            texts[president].append(nltk.corpus.state_union.words(speech))
        return [(president, texts[president]) for president in presidents]

import pylab
for president, texts in speeches()[-7:]:
    growth = list(vocab_growth(texts))[:10000]
    pylab.plot(growth, label=president, linewidth=2)
pylab.title('Vocabulary Growth in State-of-the-Union Addresses')
pylab.legend(loc='lower right')
pylab.show()
                                
