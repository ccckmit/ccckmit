var R = require("../j6");

// FFT: fast fourier transform
var z = (new R.M.complex([1,2,3,4,5],[6,7,8,9,10])).fft()
print('z=', z.strM());
print('z.ifft=', z.ifft().strM());