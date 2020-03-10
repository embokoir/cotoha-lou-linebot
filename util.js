require('dotenv').config()
const axios = require('axios')
const url = process.env.LOG_URL

async function log(event) {
    return axios.post(url, event)
        .then(res => {
            console.log('Log saved')
            return {}
        })
        .catch(err => {
            console.log(err.response)
            return {}
        })
}

async function validateText(text) {
    let res = {
        isValid: false,
        reason: ''
    }
    if (text.length > 30) {
        res.reason = '30レター以下で送ってほしい…！'
        return res
    }
    if (text.match(/^[0-9a-zA-Z ]*$/)) {
        res.reason = 'ジャパニーズを送ってほしい…！'
        return res
    }

    res.isValid = true
    return res
}


module.exports.log = log
module.exports.validateText = validateText
