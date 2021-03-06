const Queries = require('./queries');
const db = require('../db');
const TokenGenerator = require('uuid-token-generator');

/*
*  TODO:
*   * Strona tytułowa:
*       - login     (-> email, hash_hasłą/ <- token)
*       - register  (-> email, hash,_hasła, poziom/ <- token)   TOKEN jednoznacznie wyznacza użytkownika
*/

// Strona tytułowa

var tokMap = new Map();
const tokGen = new TokenGenerator();
const login = (req,res,next) => {
    let mail = req.body.email;
    let password = req.body.password;
    let vals = [mail, password];
    Queries.loginAuth(vals).then(exists => {
        if(exists) {
            let id = exists.id;
            let tok = tokGen.generate();
            tokMap.set(tok,id);
            res.status(200).json({
                token: tok
            });
            console.log("Token send");
        } else {
            res.status(400).send("Invalid login data!");
            console.log("Authorization failed");
        }
    });

}

const register = (req, res, next) => {
    let mail = req.body.email;
    let name = req.body.name;
    let surname = req.body.surname;
    let password = req.body.password;
    let phone = req.body.tel;
    let lvl = req.body.level;

    Queries.isRegistered([mail]).then(registered => {
        if (registered) {
            res.status(400).send("Account already registered!");
        } else {
            let vals = [mail, name, surname, phone, password, lvl];
            let tok = tokGen.generate();
            Queries.registerUser(vals).then(id => {
                tokMap.set(tok,id);
                console.log(id);
                res.status(200).json({
                    token: tok
                });
            }).catch(err => {
                res.status(400).send(err);
            });
    }});
}

// Dashboard
const pools = (req,res,next) => {
    Queries.getPools().then(rows => {
        res.status(200).json(rows);
    })
}

// TODO: wyświetlanie informacji o użytkowniku
const userInfo = (req, res, next) => {
    let userId = tokMap.get(req.body.token);
    Queries.getUserInfo(userId).then(row => {
      res.status(200).json(row);
    });
}

const reserve = (req,res,next) => {
    let basenId = req.body.basenId;
    let nrtoru = req.body.selectedRow+1;
    let token = req.body.token;
    let userId = tokMap.get(token);
    let date = new Date(req.body.date);
    let offsetStart = req.body.start*15;
    let offsetStop = req.body.stop*15;
    if(tokMap.has(token)) {
        Queries.reserve(userId, basenId, date, nrtoru, offsetStart, offsetStop).then((q) => {
            res.status(200).send();
        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });
    } else {
        res.status(400).send("Invalid token - please logout");
    }
}

const list = (req,res,next) => {
    let userId = tokMap.get(req.query.token);
    Queries.list(userId).then((reservationList) => {
        res.status(200).json({
            rows: reservationList
        });
    }).catch((err) => {
        res.status(400).send(err.message);
    })
}

const poolInfo = (req,res,next) => {
    Queries.getPoolInfo(req.query.id).then((rows) => {
        res.status(200).json(rows);
    }).catch((err)=>
    res.status(400).send(err.message)
    )
}

const timetable = (req,res,next) => {
    console.log(req.query.basenId)
    let date = new Date(req.query.date);
    Queries.timetable(req.query.basenId,date).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(400).send(err.message)
    });
}

const validToken = (req,res,next) => {
    res.status(200).json({
            valid: tokMap.has(req.query.token)
        }
    );
}

module.exports.pools = pools;
module.exports.register = register;
module.exports.login = login;
module.exports.reserve = reserve;
module.exports.list = list;
module.exports.poolInfo = poolInfo;
module.exports.timetable = timetable;
module.exports.validToken = validToken;