var config = require('../../config')
var got = require('got');
var request = require('request');
var downloader = require('image-downloader');
var fs = require('fs');
var path = require('path');
var http = require("http")
const { debug } = require('console');

const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(path))
        .on('close', callback)
    })
  }

module.exports = function(app, express) {
    var apiRouter = express.Router();

    apiRouter.get('/', function(req, res) {
        res.json({message: "let's get some cartones"});
    });

    apiRouter.get('/setlist/', function(req, res){
        var setUrl = config.ygoapiURI + 'cardsets.php';
        (async () => {
            try {
                const response = await got(setUrl);
                res.json({"success": true, "response": JSON.parse(response.body) })
            } catch (error) {
                console.log(error.response.body);
                res.json({"success": false, "response": error.response.body })
            }
        })();
    });

    apiRouter.get('/setcards/:setname', function(req, res){
        var infoUrl = config.ygoapiURI + 'cardinfo.php?cardset=' + req.params.setname;
        (async () => {
            try {
                const response = await got(infoUrl);
                res.json({"success": true, "response": JSON.parse(response.body) })
            } catch (error) {
                console.log(error.response.body);
                res.json({"success": false, "response": error.response.body })
            }
        })();
    });

    apiRouter.post('/downloadCardInfo/', function(req, res){
        var cardname = "";
        var carddesc = "";
        var cardprice = "";
        var cardrarity = "";
        if (req.body != {}){
            const path = './saved/' + req.body.card.id + ".jpg";
            const currentPath = './current/currentCardImage.jpg';
            if (!fs.existsSync(path)) {
                const url = req.body.card.card_images[0].image_url;
                download(url, path, () => {
                    fs.copyFile(path, currentPath, (err) => {
                        if (err) throw err;
                    });
                })
            } else {
                fs.copyFile(path, currentPath, (err) => {
                    if (err) throw err;
                });
            }

            cardname = req.body.card.name;
            carddesc = req.body.card.desc;
            var cardset = req.body.card.card_sets.find(cardSet => {
                return (cardSet.set_code.toUpperCase().startsWith(req.body.setcode.toUpperCase()));
            });
            if (cardprice == undefined){
                cardprice = "0.00"
                cardrarity = "??? Rare"
            }
            cardprice = cardset.set_price + " €";
            cardrarity = cardset.set_rarity;
        } 
        
        fs.writeFile('./current/currentCardName.txt', cardname, function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./current/currentCardEffect.txt', carddesc, function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./current/currentCardPrice.txt', cardprice, function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./current/currentCardRarity.txt', cardrarity, function (err) {
            if (err) return console.log(err);
        });

        res.json({"success": true, "response" : "OK" })
    });

    return apiRouter;
};