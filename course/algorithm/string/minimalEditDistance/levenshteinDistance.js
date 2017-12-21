// Compute the edit distance between the two given strings
/* 動態規劃法 */
var levenshteinDistance = function(a, b){
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];
  // increment along the first column of each row
  for(let i = 0; i <= b.length; i++) matrix[i] = [i];
  // increment each column in the first row
  for(let j = 0; j <= a.length; j++) matrix[0][j] = j;

  // Fill in the rest of the matrix
  for(let i = 1; i <= b.length; i++){
    for(let j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1]
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                matrix[i][j-1] + 1,   // insertion
                                matrix[i-1][j] + 1)   // deletion
      }
    }
  }

  return matrix[b.length][a.length]
}

/* 遞迴法
var levenshteinDistance = function (s, t) {
    if (s.length===0) return t.length
    if (t.length===0) return s.length

    return Math.min(
        levenshteinDistance(s.substr(1), t) + 1,
        levenshteinDistance(s, t.substr(1)) + 1,
        levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    )
}
*/

let s = 'kitten'
let t = 'sitting'

console.log('levenshteinDistance(%s,%s)=%d', s, t, levenshteinDistance (s, t))
