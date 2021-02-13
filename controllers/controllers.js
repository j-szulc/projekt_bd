const Queries = require('./queries');
const db = require('../db');
const TokenGenerator = require('uuid-token-generator');

const saySomething = (req, res, next) => {
    db.query("SELECT * FROM KONTO",(derr,dres)=> {
        res.status(200).json({
            body: dres.rows[0].mail
        });
    });
};

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
            res.status(400).json({
                msg: "Podałeś niepoprawne dane logowania!"
            })
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
            res.status(400).json({
                msg: "Konto o podanym mailu już istnieje!"
            })
            console.log("Już istnieje");
        } else {
            console.log("No to rejestrujemy");
            let vals = [mail, name, surname, phone, password, lvl];
            let tok = tokGen.generate();
            Queries.registerUser(vals).then(id => {
                tokMap.set(tok,id);
                console.log(id);
                res.status(200).json({
                    tok: tok,
                    msg: "Konto pomyślnie zarejestrowane"
                })
            }).catch(err => {
                res.status(400).json({
                    msg: err
                })
            });
       }
    })
}

// Dashboard
const pools = (req,res,next) => {
    Queries.getPools().then(rows => {
        res.status(200).json(rows);
    })
}


const reserve = (req,res,next) => {
    let basenId = req.body.basenId;
    let token = req.body.token;
    let userId = tokMap.get(token);
    let date = new Date(req.body.date);
    let offsetStart = req.body.start*15;
    let offsetStop = req.body.stop*15;
    Queries.reserve(userId, basenId, date, 1,offsetStart, offsetStop).then((q)=> {
        res.status(200).json({
            success: true
        });
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({
            msg: err.message
        })
    });
}

const list = (req,res,next) => {
    let userId = tokMap.get(req.query.token);
    Queries.list(userId).then((reservationList) => {
        res.status(200).json({
            rows: reservationList
        });
    }).catch((err) => {
        res.status(400).json({
            msg: err.message
        })
    })
}

const poolInfo = (req,res,next) => {
    Queries.getPoolInfo(req.query.id).then((rows) => {
        res.status(200).json(rows);
    }).catch((err)=>
    res.status(400).json({msg:err.message})
    )
}

const timetable = (req,res,next) => {
    console.log(req.query.basenId)
    Queries.timetable(req.query.basenId,req.query.date).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(400).json({msg:err.message})
    });
}

module.exports.saySomething = saySomething;
module.exports.pools = pools;
module.exports.register = register;
module.exports.login = login;
module.exports.reserve = reserve;
module.exports.list = list;
module.exports.poolInfo = poolInfo;
module.exports.timetable = timetable;