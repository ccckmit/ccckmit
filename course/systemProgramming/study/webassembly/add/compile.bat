# emcc add.c -s WASM=1 -s EMCC_DEBUG=1 -o add.html
emcc add.c -s WASM=1 -s "BINARYEN_METHOD='interpret-s-expr'" -o add.html