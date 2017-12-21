// Viterbi algorithm for finding hidden relationships
function Viterbi(data) {
    var V = [{}];
    var path = {};
 
    // Initialize base cases (t == 0)
    for(var i=0;i<data.states.length;i++) {
        var state = data.states[i];
        V[0][state] = data.start_probability[state] * data.emission_probability[state][data.observations[0]];
        path[state] = [state];
    }

    // Run Viterbi for t > 0
    for(var t=1;t<data.observations.length;t++) {
        V.push({});
        var newpath = {};
        
        for(var i=0;i<data.states.length;i++) {
            var state = data.states[i];
            var max = [0,null];
            for(var j=0;j<data.states.length;j++) {
                var state0 = data.states[j];
                // Calculate the probablity
                var calc = V[t-1][state0]
                    * data.transition_probability[state0][state]
                    * data.emission_probability[state][data.observations[t]];
                if(calc > max[0]) max = [calc,state0];
            }
            V[t][state] = max[0];
            newpath[state] = path[max[1]].concat(state);
        }
        path = newpath;
    }

    var max = [0,null];
    for(var i=0;i<data.states.length;i++) {
        var state = data.states[i];
        var calc = V[data.observations.length-1][state];
        if(calc > max[0]) max = [calc,state];
    }
 
    return [max[0], path[max[1]]];
}

var result = Viterbi({
    states: [
        'Rainy',
        'Sunny'
    ],
    observations: [
        'walk',
        'shop',
        'clean'
    ],
    start_probability: {
        'Rainy': 0.6,
        'Sunny': 0.4
    },
    transition_probability: {
        'Rainy' : {'Rainy': 0.7, 'Sunny': 0.3},
        'Sunny' : {'Rainy': 0.4, 'Sunny': 0.6},
    },
    emission_probability: {
        'Rainy' : {'walk': 0.1, 'shop': 0.4, 'clean': 0.5},
        'Sunny' : {'walk': 0.6, 'shop': 0.3, 'clean': 0.1},
    }
});

console.log(result[0]);
for(var i=0;i<result[1].length;i++)
    console.log((i==0?'':'->')+result[1][i]);
 