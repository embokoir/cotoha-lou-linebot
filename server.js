const dotenv = require('dotenv').config()
const axios = require('axios')
const express = require('express')
const LINE    = require('@line/bot-sdk');
const cotoha = require('./cotoha')
const lang = require('./lang')
const util = require('./util')

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const CHANNEL_SECRET       = process.env.CHANNEL_SECRET

const PORT = 3000
const app = express()
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET
}
const line = new LINE.Client(config)

app.post('/webhook', LINE.middleware(config), async (req, res) => {
    console.log(req.body.events)
    if (req.body.events[0].source.userId === 'Udeadbeefdeadbeefdeadbeefdeadbeef') {
        res.send(200)
        return
    }
    await Promise
        .all(req.body.events.map(handleEvent))
        .then(result => res.json(result))
    await Promise
        .all(req.body.events.map(util.log))
        .then(result => res.json(result))
        .catch(err => err)
})

app.listen(PORT)
console.log(`Server running at ${PORT}`)

async function handleEvent(event) {
    console.log(event)

    let replyText = ''
    switch (event.type) {
    case 'message':
        if (event.message.type === 'text') {
            const messageText = event.message.text
            const textValidation = await util.validateText(messageText)
            if (!textValidation.isValid) {
                replyText = textValidation.reason
            } else {
                replyText = await generateLou(messageText)
            }
        } else {
            replyText = 'テキストを送ってほしい…!'
        }
        break;
    case 'follow':
        replyText = 'フォローありがとう。好きなことわざを送ってくれたら、いい感じのリプライをセンドするかも…'
        + '\n\nCOTOHA APIを利用してキーワードを抽出しています。詳しくはこちら https://example.com'
        break;
    default:
        replyText = 'テキストを送ってほしい…!!'
        break;
    }

    return line.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
    })
}

async function generateLou(sentence) {
    const document = [sentence]
    const keywords = await cotoha.extractKeywords(document)

    let replacedSentence = sentence
    const keyword = keywords ? keywords[0].form : sentence
    console.log(keyword)

    let keywordEn = await lang.translate(keyword)
    console.log(keywordEn)

    let keywordEnKatakana = await lang.convertAbcToKatakana(keywordEn)
    console.log(keywordEnKatakana)

    replacedSentence = replacedSentence.replace(new RegExp(keyword, 'g'), keywordEnKatakana)
    replacedSentence = keywords ? replacedSentence : 'COTOHA APIはキーワードを抽出できなかったので、全文訳です\n\n' + replacedSentence
    console.log(replacedSentence)

    return replacedSentence
}
