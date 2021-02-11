const db = require('../db');

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
const login = (req,res,next) => {
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