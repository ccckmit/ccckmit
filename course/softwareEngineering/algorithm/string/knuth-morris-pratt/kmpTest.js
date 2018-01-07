let kmp = require('./kmp')

console.log('kmp(she sells seashells by the seashore, shell) = ', kmp('she sells seashells by the seashore', 'shell')); // 13
console.log('kmp(she sells seashells by the seashore, seaweed) = ', kmp('she sells seashells by the seashore', 'seaweed')); // -1