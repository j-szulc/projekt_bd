const db = require('../db');

class Queries {
    static async loginAuth(vals) {
        let res = await db.query('SELECT id FROM konto WHERE mail = $1 AND haszhasla = $2', vals);
        return res.rows[0];
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
        let res = await db.query('INSERT INTO konto(mail, id, imie, nazwisko, nrtelefonu, haszhasla, poziomzaawansowania)' +
            ' VALUES($1, DEFAULT, $2, $3, $4, $5, $6) RETURNING id', vals);
        return res.rows[0].id;
    }

    static async list(userId) {
        let res = await db.query('SELECT * FROM rezerwacja WHERE idkonta = $1', [userId]);
        return res.rows;
    }

    static async reserve(userId, basenId, date, nrToru, offsetStart, offsetStop) {
        // TODO check day of the week ordering
        // TODO auth
        let dayOfTheWeek = date.getDay()+1;
        let cennik = (await db.query('SELECT * FROM cennikigodzinyotwarcia WHERE idbasenu = $1 AND dzientygodnia = $2',[basenId, dayOfTheWeek])).rows[0];
        let offset = cennik.otwarteod;
        let start = offset + offsetStart;
        let stop  = offset + offsetStop;
        if(stop <= cennik.otwartedo){
            let vals=[basenId,userId,nrToru,start,stop,"2000-01-01"];
            let id = await db.query('INSERT INTO rezerwacja(id,idbasenu,idkonta,nrtoru,liczbaosob,czyrezerwacjacalegotoru,czasod,czasdo,dzien) VALUES(DEFAULT, $1, $2, $3, DEFAULT, DEFAULT, $4,$5,$6) RETURNING id',vals);
            return id.rows[0].id;
        } else
            return false;

    }
}

module.exports = Queries;