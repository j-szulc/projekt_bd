const db = require('../db');

const minutesToStr = (min) => (min/60|0).toString().padStart(2,"0") + ":" + (min%60).toString().padStart(2,"0");

const dateToPG = (date) => date.getFullYear().toString()+"-"+(date.getMonth()+1).toString().padStart(2,"0")+"-"+date.getDate().toString().padStart(2,"0");

class Queries {
    static async loginAuth(vals) {
        let res = await db.query('SELECT id FROM konto WHERE mail = $1 AND haszhasla = $2', vals);
        return res.rows[0];
    }

    static async getPools() {
        let res = await db.query('SELECT * FROM basen');
        return res.rows;
    }

    static async getPoolInfo(poolId) {
        let res = await db.query('SELECT * FROM basen WHERE id=$1',[poolId]);
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

    static async cennik(basenId, dayOfTheWeek){
        return (await db.query('SELECT * FROM cennikigodzinyotwarcia WHERE idbasenu = $1 AND dzientygodnia = $2',[basenId, dayOfTheWeek])).rows[0];
    }

    static async reserve(userId, basenId, date, nrToru, offsetStart, offsetStop) {
        // TODO check day of the week ordering
        // TODO auth
        let time = dateToPG(date);
        let dayOfTheWeek = date.getDay()+1;
        let cennik = await this.cennik(basenId,dayOfTheWeek);
        let offset = cennik.otwarteod;
        let start = offset + offsetStart;
        let stop  = offset + offsetStop+15;
        if(stop <= cennik.otwartedo){
            let vals=[basenId,userId,nrToru,start,stop,time];
            let id = await db.query('INSERT INTO rezerwacja(id,idbasenu,idkonta,nrtoru,liczbaosob,czyrezerwacjacalegotoru,czasod,czasdo,dzien) VALUES(DEFAULT, $1, $2, $3, DEFAULT, DEFAULT, $4,$5,$6) RETURNING id',vals);
            return id.rows[0].id;
        } else
            return false;

    }

    static async timetable(basenId,date){
        let vals = [basenId,dateToPG(date)];
        let rezerwacje = (await db.query("SELECT * FROM rezerwacja WHERE idbasenu=$1 AND dzien=$2",vals)).rows;
        let poolInfo = (await this.getPoolInfo(basenId))[0];
        let cennik = (await this.cennik(basenId,new Date(date).getDay()+1));
        let headers = [];
        let slots = 0;
        for(let czas=cennik.otwarteod; czas<=cennik.otwartedo-15; czas+=15) {
            headers.push(minutesToStr(czas));
            slots++;
        }
        let data = new Array(poolInfo.ilosctorow);
        for(let i=0; i<data.length; i++){
            data[i] = new Array(slots);
            data[i].fill(0);
        }
        rezerwacje.map((row)=>{
            let start = headers.indexOf(minutesToStr(row.czasod));
            let stop = headers.indexOf(minutesToStr(row.czasdo));
            for(let i=start; i<stop; i++){
                data[row.nrtoru-1][i]+=1;
            }
        });
        return {headers:headers, data:data};
    }
}

module.exports = Queries;