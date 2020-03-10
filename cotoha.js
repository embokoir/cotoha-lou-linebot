const dotenv = require('dotenv').config()
const axios = require('axios')

const ACCESS_TOKEN_PUBLISH_URL = process.env.ACCESS_TOKEN_PUBLISH_URL
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const BASE_URL = 'https://api.ce-cotoha.com/api/dev/'

async function extractKeywords(documentArray) {
    const urlEndPoint = 'nlp/v1/keyword'
    return axios({
        url: BASE_URL + urlEndPoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${await getAccessToken()}`
        },
        data: {
            'document': documentArray
        }
    }).then(res => {
        const keywords = res.data.result
        if (keywords.length === 0) return false
        return keywords
    }).catch(err => {
        console.log(err.response.status)
        console.log(err.response.data)
        return false
    })
}

module.exports.extractKeywords = extractKeywords

async function getAccessToken() {
    return axios({
        url: ACCESS_TOKEN_PUBLISH_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'grantType': "client_credentials",
            'clientId': CLIENT_ID,
            'clientSecret': CLIENT_SECRET
        }
    }).then(res => {
        // console.log('access token successfully got')
        // console.log(res.status)
        // console.log(res.data)
        // console.log(res.data.access_token)
        return res.data.access_token
    }).catch(err => {
        console.log('access token error')
        console.log(err.response.status)
        console.log(err.response.data)
        return ''
    })
}


// not in use
async function splitIntoChunks(sentence) {
    if (!sentence) {
        console.log('Invalid sentence')
        return false
    }

    const urlEndPoint = 'nlp/v1/parse'
    return axios({
        url: BASE_URL + urlEndPoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${await getAccessToken()}`
        },
        data: {
            'sentence': sentence
        }
    }).then(res => {
        const chunks = res.data.result
        return chunks
    }).catch(err => {
        console.log(err.response.status)
        console.log(err.response.data)
        return ''
    })
}
