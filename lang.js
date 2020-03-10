const axios = require('axios')

async function translate(textJapanese) {
    require('dotenv').config()
    const translationUrl = process.env.TRANSLATION_URL
    return axios.get(`${translationUrl}?textJa=${encodeURIComponent(textJapanese)}`)
        .then(res => {
            return res.data.textEn
        })
        .catch(err => {
            console.log(err.response)
            return false
        })
}

async function convertAbcToKatakana(textEn) {
    const url = `https://www.sljfaq.org/cgi/e2k.cgi?o=json&word=${textEn}&lang=en`
    return axios.get(url)
        .then(res => {
            return res.data.words.map(word => word.j_pron_spell).join('')
        })
        .catch(err => {
            console.log(err.response)
            return false
        })
}

module.exports.translate = translate
module.exports.convertAbcToKatakana = convertAbcToKatakana
