const fs = require('fs')
const readline = require('readline')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const crypto = require('crypto')
const axios = require('axios')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

axios.defaults.headers.common['User-Agent'] = 'Spanish Flashcards - contact spanish@kevapps.com with any issues';

const spreadsheetId = '1xl8zNXQJSnEFpEIeX7fYMht_BMwISDQiIAJYkEICXO0'
const pixalBayApiKey = JSON.parse(fs.readFileSync('../secrets/pixelbay.json')).apiKey
const giphyApiKey = JSON.parse(fs.readFileSync('../secrets/giphy.json')).apiKey


// google text-to-speech
const textToSpeech = require('@google-cloud/text-to-speech');
const ttsClient = new textToSpeech.TextToSpeechClient({keyFilename: '/secrets/spanish-photo-flash-tts.json'});

// google storage
const {Storage} = require('@google-cloud/storage')
const storage = new Storage({keyFilename: '/secrets/spanish-photo-flash-decks-2b5f6a11103f.json'})
const fullDecksBucket = 'spf-full-decks'
const decksBucket = 'spf-decks'

main()

async function main () {
    const deckDataSpreadsheet = new GoogleSpreadsheet(spreadsheetId)
  
    await deckDataSpreadsheet.useServiceAccountAuth(require('/secrets/spanish-photo-flash-decks-2b5f6a11103f.json'));

    await deckDataSpreadsheet.loadInfo(); // loads document properties and worksheets

    let deckList = await getDeckList(deckDataSpreadsheet)
    // deckList = [deckList[0], deckList[1]]
    // deckList = {
    //     '25 Nouns': deckList['25 Nouns'],
    //     '25 Verbs': deckList['25 Verbs'],
    //     // '100 Verbs': deckList['100 Verbs'],
    //     '20 House Nouns': deckList['20 House Nouns'],
    //     // '25 Adjectives': deckList['25 Adjectives'],
    //     // '5 Verbs': deckList['5 Verbs'],
    // }
    // [deckList[], deckList[1]]

    let rateLimited = false
    let changed = false
    console.log('deckList', deckList)
    for (let deckIdx in deckList) {
        let deck = deckList[deckIdx]
        let cards = await getCards(deckDataSpreadsheet, deck)

        for (let cardIdx in cards) {
            let card = cards[cardIdx]
            console.log("processing", deck.name, card.question)
            if (!card.audio) {
                console.log("getting audio")
                console.log("getting audio")
                console.log("getting audio")
                changed = true
                cards[cardIdx] = await getAudio(card)
            } else {
                console.log("audio already present")
            }
            // if (deck.name === '25 Verbs') {
            //     card.images = false
            // }
            // card.images = false
            if (!card.images && !rateLimited) {
                changed = true
                console.log("getting images", deck.type)
                console.log("getting images", deck.type)
                console.log("getting images", deck.type)
                console.log("getting images", deck.type)
                let imgCard = await getImages(deck.type, card)
                if (imgCard !== false) {
                    cards[cardIdx] = imgCard
                } else {
                    rateLimited = true
                }
                await new Promise(r => setTimeout(r, 2500))
            } else {
                console.log("images already present")
            }
            // console.log("Object.keys(card.images)", Object.keys(card.images))
        }
        if (changed) {
            console.log('saving deck', deck.nameNS + '.json')
            await saveData(deck.nameNS + '.json', cards)
        }
    }
    console.log("DeckList")
    for (let deckIdx in deckList) {
        try {
            deckList[deckIdx].size = await getDeckSize(deckList[deckIdx].nameNS + '.json')
        } catch (error) {
            console.log('could not get deck size for', deckList[deckIdx].name)
        } 
    }

    await saveData('decklist.json', deckList, true)

    let server = express()
    server.use(bodyParser.json())
    let selectedDeck = {}
    let selectedDeckNameNS = false
    server.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/decks.html'))
    })
    server.get('/decklist', async (req, res) => {
        let dataReq = await storage.bucket(decksBucket).file('decklist.json').download()
        let dataString = dataReq[0].toString()
        res.send(dataString)
    })
    server.get('/decks/:deckNameNS', async (req, res) => {
        selectedDeckNameNS = req.params.deckNameNS
        let dataReq = await storage.bucket(fullDecksBucket).file(selectedDeckNameNS + '.json').download()
        let dataString = dataReq[0].toString()
        selectedDeck = JSON.parse(dataString)
        res.send(dataString)
    })
    server.post('/decks/:deckNameNS', async (req, res) => {
        if (!Object.keys(req.body).length) {
            console.log('no data received, could not save')
            res.sendStatus(500)
            return
        }
        // console.log("req", req)
        console.log("req.body", req.body)
        let selections = req.body
        console.log("selections", selections)
        // deselect all
        Object.keys(selectedDeck).forEach(cardKey => {
            Object.keys(selectedDeck[cardKey].images).forEach(imgKey => {
                selectedDeck[cardKey].images[imgKey].selected = false
            })
        })
        let outputDeck = {}
        Object.keys(selections).forEach(cardKey => {
            let selectedImage = selections[cardKey]
            selectedDeck[cardKey].images[selectedImage].selected = true
            outputDeck[cardKey] = {
                question: selectedDeck[cardKey].question,
                answer: selectedDeck[cardKey].answer,
                image: selectedDeck[cardKey].images[selectedImage].data,
                audio: selectedDeck[cardKey].audio
            }
        })
        
        await saveData(selectedDeckNameNS + '.json', selectedDeck)
        await saveData(selectedDeckNameNS + '.json', outputDeck, true)

        res.sendStatus(200)
    })
    console.log("serving")
    server.listen(80)
    // console.log("deckList", deckList)
    // for deck in decks:
    //   get deckWords
    //   get prevDeckData
    //   for word in deckwords:
    //     if no images:
    //         get images
    //     if no audio:
    //         get audio
    // launch express
    // on post deck:
    //   update deck selections      
    // on post complete:
    //   for deck in decks:
    //     write prod deck
}

// get list of decks, including name, version and type
async function getDeckList(deckDataSpreadsheet) {
    console.log(deckDataSpreadsheet.title);  
    const decksSheet = deckDataSpreadsheet.sheetsByIndex[0]; // or use doc.sheetsById[id]

    const maxRows = 25
    await decksSheet.loadCells(`A1:D${maxRows}`);

    let deckList = {}
    for (let rowIdx=0; rowIdx<maxRows; rowIdx++) {
        const deckName = decksSheet.getCell(rowIdx, 0).value
        const deckEnabled = decksSheet.getCell(rowIdx, 3).value === 'x'
        if (deckName && deckEnabled) {
            console.log('deckName', deckName)
            deckList[deckName] = {
                name: deckName,
                nameNS: deckName.replace(/ /g, ''),
                type: decksSheet.getCell(rowIdx, 1).value,
                version: decksSheet.getCell(rowIdx, 2).value
            }
        }
    }

    return deckList
}

// get questions and answers from spreadsheet
// get any previous deck data
// loop through words
async function getCards(deckDataSpreadsheet, deck) {
    const deckSheet = deckDataSpreadsheet.sheetsByTitle[deck.name]; // or use doc.sheetsById[id]

    await deckSheet.loadCells(`A1:B200`);

    let prevCards = {}
    try {
        let fileData = await storage.bucket(fullDecksBucket).file(deck.nameNS + '.json').download()
        prevCards = JSON.parse(fileData[0].toString())
    } catch (e) {
        console.log("No prev deck data")
    }

    let cards = {}

    const cardStructureJSON = JSON.stringify({
        index: -1,
        question: null,
        images: false,
        audio: false,
        answer: null
    })

    
    for (let rowIdx=0; rowIdx<200; rowIdx++) {
        const referenceWord = deckSheet.getCell(rowIdx, 0).value
        if (!referenceWord) continue
        const question = deckSheet.getCell(rowIdx, 1).value
        let card = {}
        let cardStructure = JSON.parse(cardStructureJSON)
        for (let key in cardStructure) {
            if (question in prevCards) {
                card[key] = prevCards[question][key]
            } else {
                card[key] = cardStructure[key]
            }
        }
        card.index = rowIdx
        card.question = question
        card.answer = referenceWord

        cards[card.question] = card
    }

    return cards
}


// get images
async function getImages(imgType, card) {
    card.images = {}

    let url = imgType === 'gifs' ?
        `http://api.giphy.com/v1/gifs/search?q=${card.answer.replace(/ /g, '+')}&api_key=${giphyApiKey}&limit=8`
        : `https://pixabay.com/api/?key=${pixalBayApiKey}&per_page=10&safesearch=true&q=${card.answer.replace(/ /g, '+')}&image_type=photo&pretty=true`
    
    let resp
    try {
        await new Promise(r => setTimeout(r, 500))
        resp = await axios.get(url)
    } catch (e) {
        console.log("We've been RATELIMITED!", e)
        return false
    }
    // console.log("url", url)
    // console.log("resp.data", resp.data)
    let imgList = imgType === 'gifs' ? resp.data.data : resp.data.hits

    // console.log("imgList", imgList)
    for (let imgIdx in imgList) {
        let resInfo = imgList[imgIdx]
        // console.log("resInfo.images", resInfo.images)
        // console.log("resInfo.images.original", resInfo.images.original)
        // return
               
        let ext = imgType === 'gifs' ? 'gif'
            : resInfo.previewURL.split('.').pop().toLowerCase()

        if (ext === 'jpg') ext = 'jpeg'

        let imgId = imgType === 'gifs' ? resInfo.id : resInfo.id.toString()
        let imgSrc = imgType === 'gifs' ? 'giphy' : 'pixabay'
        let imgHash = crypto.createHash('md5').update(imgSrc + imgId).digest('hex')
        console.log("imgHash", imgHash)
        let imgReqUrl
        try {
            imgReqUrl = imgType === 'gifs' ? resInfo.images.fixed_width.url
                : resInfo.webformatURL
        } catch (e) {
            console.log("Missing GIFY URL", e)
            return
        }
        // console.log("thing", thing)
        let imgData
        let tmpFileName = `tmp/${imgHash}`
        if (fs.existsSync(tmpFileName)) {
            console.log('getting img from cache')
            imgData = fs.readFileSync(tmpFileName).toString()
            console.log('imgData', imgData.slice(0, 100))
        } else {
            console.log('getting image')
            await new Promise(r => setTimeout(r, 500))
            let imgReq = await axios.get(imgReqUrl, {responseType: 'arraybuffer'})
            imgData = `data:image/${ext};base64,` + Buffer.from(imgReq.data, 'binary').toString('base64')
            console.log('imgData', imgData.slice(0, 100))
            console.log('image getted')
            if (!fs.existsSync('tmp')) fs.mkdirSync('tmp')
            fs.writeFileSync(tmpFileName, imgData)
        }

        card.images[imgHash] = {
            id: imgId,
            src: imgSrc,
            data: imgData,
            selected: false
        }
    }
    return card
}

// get audio
async function getAudio(card) {
    let request = {
        input: { text: card.question },
        voice: {
        languageCode: 'es-ES',
        ssmlGender: 'FEMALE',
        name: 'es-ES-Standard-A'
        },
        audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0,
        effectsProfileId: ['headphone-class-device'],
        speakingRate: '.9'
        },
    };
    let [response] = await ttsClient.synthesizeSpeech(request)
    card.audio = 'data:audio/mp3;base64,' + response.audioContent.toString('base64')
    return card
}

async function getDeckSize(filename) {
    console.log('getting deck size for', filename)
    const [metadata] = await storage.bucket(decksBucket).file(filename).getMetadata()
    let size = metadata.size
    console.log("size", size)
    return size
}

async function saveData(filename, data, public) {
    if (public) {
        await storage.bucket(decksBucket).file(filename).save(JSON.stringify(data), {gzip: true, resumable: false})
    } else {
        await storage.bucket(fullDecksBucket).file(filename).save(JSON.stringify(data), {gzip: true, resumable: false})
    }
}
