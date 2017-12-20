// Reference : 'Programming Collective Intellignece' by Toby Segaran.

var j6 = require('../../lib/j6')

var data =[['slashdot','USA','yes',18],
           ['google','France','yes',23],
           ['digg','USA','yes',24],
           ['kiwitobes','France','yes',23],
           ['google','UK','no',21],
           ['(direct)','New Zealand','no',12],
           ['(direct)','UK','no',21],
           ['google','USA','no',24],
           ['slashdot','France','yes',19],
           ['digg','USA','no',18,],
           ['google','UK','no',18,],
           ['kiwitobes','UK','no',19],
           ['digg','New Zealand','yes',12],
           ['slashdot','UK','no',21],
           ['google','UK','yes',18],
           ['kiwitobes','France','yes',19]];
var result = ['None','Premium','Basic','Basic','Premium','None','Basic','Premium','None','None','None','None','Basic','None','Basic','Basic'];

var dt = new j6.ML.DecisionTree({
    data : data,
    result : result
});

dt.build();

// dt.print();

console.log("Classify : ", dt.classify(['(direct)','USA','yes',5]));

dt.prune(1.0); // 1.0 : mingain.
dt.print();