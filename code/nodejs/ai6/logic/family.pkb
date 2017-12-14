parent(x,y)   <= father(x,y).
parent(x,y)   <= mother(x,y).
ancestor(x,y) <= parent(x,y).
ancestor(x,z) <= ancestor(x,y) & parent(y,z).

father(John, Johnson).
mother(Mary, Johnson).
father(George, John).
father(John, Jake).