var Jimp = require("jimp");

Jimp.read("lenna.png").then(function (lenna) {
    lenna.resize(256, 256)            // resize
         .quality(60)                 // set JPEG quality
         .greyscale()                 // set greyscale
         .write("lena-small-bw.jpg"); // save
}).catch(function (err) {
    console.error(err);
});