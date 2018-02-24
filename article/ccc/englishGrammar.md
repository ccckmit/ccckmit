# 英語的語法

```
SENTENCE: STATEMENT | QUESTION | COMMAND 
STATEMENT: ADJ+[] ADVERB+[] (SUBJECT) ADJECTIVE+[] (VERB)
QUESTION: ADJ+[] ADVERB+[] (DO SUBJECT) ADJECTIVE+[] (VERB)
COMMAND: ADJ+[] ADVERB+[] (VERB)

ADVERB: ADV
| WHEN (STATEMENT)
| IF (STATEMENT) 
| GERUND 
| PREPLY NP
ADJECTIVE: GERUND | PREPISH NP | ADJ
WHEN: "when" | "whereby" | "until" | "unless" 
IF: ["not"] ("if" | "only if" | "because") 
AND: "and" | "but" | "or"
PREPLY: [not] ("to"|"onto"|"into"|"of"|"out of"|"in"|"within"|"by"|"with"|"without")
PREPISH: [not] ("to"|"of"|"in"|"by"|"with"|"without")
ADJ: ADJ ("and"|",") ADJ | GERUND
NP: (("a"|"the") (ADJ+[] SNP))} WHICH CLAUSE
CLAUSE: ADJECTIVE+[] ADVERB+[] SUBJECT VERB
| ADJECTIVE+[] ADVERB+[] SUBJECT VERB PREP 
SUBJECT: NP
OBJECT: NP
WHICH: "that" | ""
GERUND: FOGHORN GER
FOGHORN: (PREPLY "-" NP)[] "-" OBJECT
ADJ: ADJ AND ADJ|
"purple"| "smelly"| "happy"| "windy" | "unbelievable" etc.
ADV: ADV AND ADV |
"quicky" | "slowly" | "happily"
NOUN: "cat" | "dog" | "man" | etc.
VERB: ("berate" [OBJECT]) | ("stop" [OBJECT]) | ("flee" [OBJECT]) | ("put" OBJECT) LOCATION+ ...
GER: "berating" | "stopping" | "fleeing" | "putting" etc.
```

## 參考文獻
* [English Defined as a Formal Grammar](http://able2know.org/topic/30765-1)
 * <http://www.scientificpsychic.com/grammar/enggram1.html>
* <http://www.cs.pomona.edu/classes/cs181NLP/text/>
 * [Chapter 12. Formal Grammars of English (pdf)](http://www.cs.pomona.edu/classes/cs181NLP/text/12.pdf)
* [Is there an EBNF that covers all of English](http://english.stackexchange.com/questions/32447/is-there-an-ebnf-that-covers-all-of-english)
