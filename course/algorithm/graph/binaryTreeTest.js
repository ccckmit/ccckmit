var binaryTree = require('./binaryTree')
var tree = new binaryTree()

var pairs = [
    {key:"ccc", node:"ccc123"}, 
    {key:"abc", node:"abc123"}, 
    {key:"snoopy", node:"snoopy123"}, 
    {key:"tim", node:"tim123"}, 
    {key:"grafield", node:"garfield123"}, 
    {key:"jack", node:"jack123"}, 
]

for (let pair of pairs) {
  tree.add(pair.key, pair.node)
}

console.log(tree.search('tim'))