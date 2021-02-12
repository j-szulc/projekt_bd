const db = require('../db');

class Queries {
    static async loginAuth(vals) {
        let res = await db.query('SELECT COUNT(mail) FROM konto WHERE mail = $1 AND haszhasla = $2', vals);
        return res.rows[0].count > 0;
    }

    static async getPools() {
        let res = await db.query('SELECT * FROM basen');
        return res.rows;
    }

    static async isRegistered(mail) {
        let res = await db.query('SELECT * FROM konto WHERE mail = $1', mail)
        return res.rowCount > 0;
    }

    static async registerUser(vals) {
        let res = await db.query('INSERT INTO konto(mail, imie, nazwisko, nrtelefonu, haszhasla) VALUES($1, $2, $3, $4, $5) RETURNING id', vals);
        return res;
    }
}

module.exports = Queries;