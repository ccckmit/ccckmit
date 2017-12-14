// 本程式不需要 google key
const translate = require('google-translate-api');

translate('請問你是誰？', {to: 'en'}).then(res => {
    console.log(res.text);
    console.log(res.from.language.iso);
}).catch(err => {
    console.error(err);
});