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

var tokenMap = new Map();
const tokGen = new TokenGenerator();

const login_query = 'SELECT COUNT(mail) FROM konto WHERE mail = $1 AND haszhasla = $2';
const login = (req,res,next) => {
    console.log("Mail: " + req.body.email + " haszhasla: " + req.body.password);
    let vals = [req.body.email, req.body.password];
    db.query(login_query, vals, (qerr, qres) => {
        console.log(qres.rowCount)
    });

    console.log("Your token is:" + tokGen.generate());

    // wysyłać token / error !
    res.status(200).json({
        success: true
    });
}

const pools = (req,res,next) => {
    res.status(200).json({
        rows: [[2, 'morsowanie nad Bałtykiem', 'Bałtycka 69'],
        [3,'morsowanie na mokotowskim','Pole Mokotowskie 42']]
    });
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