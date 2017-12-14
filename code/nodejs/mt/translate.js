// 本程式需要 google key

var translate = require('translate')

const mtTest = async () => {
    const text = await translate('こんにちは世界', { from: 'ja', to: 'es' });
    console.log(text);  // Hello World!
};

mtTest().catch(function(error) {
    // rejection
    console.log('error=', error)
 })