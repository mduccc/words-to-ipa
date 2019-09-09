module.exports = class Crawl {

    constructor() {
        this.Crawler = require('crawler')
        this.wordArray = []
        this.wordCount = 0
        this.fs = require('fs')
    }

    random(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async work(url, callback, time_sleep) {
        let fs = require('fs')
        let md5 = require('md5')

        let newWordArray = this.wordArray
        let newWordCount = this.wordCount
        let c = new this.Crawler({
            maxConnections: 1,
            // This will be called for each crawled page
            callback: async function (error, res, done) {
                console.log('-------------Started crawl----------------')
                console.log(newWordCount, ' => ', newWordArray[newWordCount])
                let date = new Date()
                let objResult = null
                if (error) {
                    console.log(error)
                    fs.writeFileSync('./logs/' + date.getTime(), error + '\nbreak from line ' + newWordCount + ' from words.txt')
                } else {
                    const cheerio = require('cheerio')
                    var $ = res.$
                    let US = null
                    let UK = null
                    let pos = null
                    // If have element .uk and .us
                    if ($('.entry-body').find('.uk').length > 0) {
                        //console.log('element is exists')
                        let UkObj = cheerio.load($(".uk").html())
                        UK = UkObj('.ipa').text()
                        // console.log(word, ' => ', UK)
                    }

                    if ($('.entry-body').find('.us').length > 0) {
                        let UsObj = cheerio.load($(".us").html())
                        US = UsObj('.ipa').text()
                        // console.log(word, '=>', US)
                    }

                    if ($('.entry-body').find('.pos').length > 0) {
                        let posObj = cheerio.load($('.pos').html())
                        pos = posObj.text()
                        console.log('pos => ', pos)
                    }

                    objResult = {
                        [newWordArray[newWordCount]]: {
                            uk: UK,
                            us: US,
                            pos: pos
                        }
                    }

                    console.log(objResult)

                    fs.writeFileSync('./files/' + md5(newWordArray[newWordCount]), JSON.stringify(objResult))
                    fs.writeFileSync('point.txt', newWordCount + '\n')
                    console.log('-------------Finished crawl----------------')
                    callback(objResult)
                    done()
                    let sleep = require('sleep')
                    sleep.sleep(time_sleep)
                    newWordCount++
                    c.queue(url + newWordArray[newWordCount] + '?q=' + newWordArray[newWordCount])
                }
            }
        })

        c.queue(url + newWordArray[newWordCount] + '?q=' + newWordArray[newWordCount])
    }
}