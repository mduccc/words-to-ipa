const express = require('express')
const app = express()
const port = 4000
const crawl = require('./Crawl')
const fs = require('fs')
const Crawl = new crawl()
const url = 'https://dictionary.cambridge.org/vi/dictionary/english/'

app.listen(port, () => {
    console.log('Running on ', port)
})

let datas = []
Crawl.wordArray = fs.readFileSync('./words.txt', 'utf8').split('\n')
Crawl.wordCount = fs.readFileSync('point.txt', 'utf8').split('\n')[0]
console.log(Crawl.wordCount)
Crawl.work(url, data => {
    if (data != null) 
        datas.push(data)
})