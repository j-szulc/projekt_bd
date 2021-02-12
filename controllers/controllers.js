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

const login_query = 'SELECT COUNT(mail) FROM konto WHERE mail = $1 AND haszhasla = $2';
const login = (req,res,next) => {
    let mail = req.body.email;
    let password = req.body.password;
    let vals = [mail, password];
    db.query(login_query, vals, (qerr, qres) => {
        let exists = qres.rows[0].count > 0;
        console.log(exists);
        if(exists) {
            let tok = tokGen.generate();
            tokMap.set(mail, tok);
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

const pools_query = 'SELECT * FROM basen';
const pools = (req,res,next) => {
    db.query(pools_query, (qerr, qres) => {
        res.status(200).json(qres.rows);
    })
}


const reserve = (req,res,next) => {
    res.status(200).json({
        success: true
    });
}

module.exports.saySomething = saySomething;
module.exports.pools = pools;
module.exports.login = login;
module.exports.reserve = reserve;