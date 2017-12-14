G.loadImage('./demo/demo_small.jpg', function(image) {
  console.log('load Image complete!');
  G.drawCanvas('#chart1', function(ctx1, canvas1) {
    ctx1.drawImage(image, 0, 0);
		ctx1.fillText('Hello World!', 10, 50);
		var idata = G.getImageData(canvas1);
		G.gray(idata);
		G.drawCanvas('#chart2', function(ctx2) {
			ctx2.putImageData(idata, 0, 0);
		});
		idata = G.getImageData(canvas1);
		G.bright(idata, 50);
		G.drawCanvas('#chart3', function(ctx) {
			ctx.putImageData(idata, 0, 0);
		});
		idata = G.getImageData(canvas1);
		G.threshold(idata, 128);
		G.drawCanvas('#chart4', function(ctx) {
			ctx.putImageData(idata, 0, 0);
		});
		idata = G.getImageData(canvas1);
		var blurData = G.blurC(idata);
		G.drawCanvas('#chart5', function(ctx) {
			ctx.putImageData(blurData, 0, 0);
		});
		idata = G.getImageData(canvas1);
		var sharpenData = G.sharpen(idata);
		G.drawCanvas('#chart6', function(ctx) {
			ctx.putImageData(sharpenData, 0, 0);
		});
		idata = G.getImageData(canvas1);
		var sobelData = G.sobel(idata);
		G.drawCanvas('#chart7', function(ctx) {
			ctx.putImageData(sobelData, 0, 0);
		});
		idata = G.getImageData(canvas1);
		var sobelData = G.sobel(idata);
		var weights = 
		[1,  1,  1,
		 1,0.7, -1,
		-1,-1 , -1];
		idata = G.getImageData(canvas1);
		var convData = G.convolute(idata, weights, true);
		G.drawCanvas('#chart8', function(ctx) {
			ctx.putImageData(convData, 0, 0);
		});
		var weights = 
		[-1, -1, -1,
		 -1,0.3, 1,
		 1,   1, 1];
		idata = G.getImageData(canvas1);
		var conv2Data = G.convolute(idata, weights, true);
		G.drawCanvas('#chart9', function(ctx) {
			ctx.putImageData(conv2Data, 0, 0);
		});
	});
});