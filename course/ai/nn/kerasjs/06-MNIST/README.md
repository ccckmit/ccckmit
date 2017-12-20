// 待整合： https://github.com/oliver-moran/jimp (好像蠻強的!)
// 可取得影像內容：
//   image.bitmap.data;  // a Buffer of the raw bitmap data
//   image.bitmap.width; // the width of the image
//   image.bitmap.height // the height of the image
        // scaled to 28 x 28
        const ctxScaled = document.getElementById('input-canvas-scaled').getContext('2d')
        ctxScaled.save()
        ctxScaled.scale(28 / ctxCenterCrop.canvas.width, 28 / ctxCenterCrop.canvas.height)
        ctxScaled.clearRect(0, 0, ctxCenterCrop.canvas.width, ctxCenterCrop.canvas.height)
        ctxScaled.drawImage(document.getElementById('input-canvas-centercrop'), 0, 0)
        const imageDataScaled = ctxScaled.getImageData(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height)
        ctxScaled.restore()
        // process image data for model input
        const { data } = imageDataScaled
        this.input = new Float32Array(784)
        for (let i = 0, len = data.length; i < len; i += 4) {
          this.input[i / 4] = data[i + 3] / 255
        }
        this.model.predict({ input: this.input }).then(outputData => {
          this.output = outputData.output
          this.getIntermediateResults()
        })

https://github.com/transcranial/keras-js/blob/master/demos/src/components/models/MnistCnn.vue