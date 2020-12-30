CREATE TABLE Basen
(
    id         NUMBER(6) PRIMARY KEY,
    nazwa      VARCHAR2(100) UNIQUE NOT NULL,
    adres      VARCHAR2(100) UNIQUE NOT NULL,
    mail       VARCHAR2(100) UNIQUE NOT NULL,
    nrTelefonu VARCHAR2(100) UNIQUE NOT NULL,
    iloscTorow NUMBER(6)            NOT NULL CHECK (iloscTorow > 0)
);

CREATE TABLE CennikIGodzinyOtwarcia
(
    idBasenu      NUMBER(6) NOT NULL REFERENCES Basen (id),
    dzienTygodnia NUMBER(1) NOT NULL CHECK (dzienTygodnia BETWEEN 1 AND 7),
    otwarteOd     NUMBER(4) NOT NULL CHECK (otwarteOd BETWEEN 0 AND 60 * 24),
    otwarteDo     NUMBER(4) NOT NULL CHECK (otwarteDo BETWEEN 0 AND 60 * 24),
    cenaIndywidualna NUMBER(6) NOT NULL CHECK (cenaIndywidualna >= 0),
    cenaGrupowa      NUMBER(6) NOT NULL CHECK (cenaGrupowa >= 0),
    CONSTRAINT otwarciePrzedZamknieciem CHECK (otwarteOd < otwarteDo)
);

-- Sprawdzanie czy przedziały czasowe są spójne.

CREATE OR REPLACE TRIGGER czyNieNachodzaNaSiebie
    BEFORE INSERT OR UPDATE ON CennikIGodzinyOtwarcia
    FOR EACH ROW
    DECLARE
        ileNachodzi NUMBER;
    BEGIN
        SELECT COUNT(*) INTO ileNachodzi FROM CennikIGodzinyOtwarcia WHERE otwarteOd < :NEW.otwarteDo AND otwarteDo > :NEW.otwarteOd;
        IF ileNachodzi > 0 THEN
            raise_application_error(-20006, 'Rekordy cennika nachodzą na siebie!');
        END IF;
    END;


CREATE TABLE ObostrzeniaSanitarne
(
    idBasenu             NUMBER(6) NOT NULL REFERENCES Basen (id),
    podstawoweInformacje VARCHAR2(1000) NOT NULL,
    maxLiczbaOsobNaTorze NUMBER(6)      NOT NULL
);

CREATE TABLE Konto
(
    id         NUMBER(6) PRIMARY KEY,
    imie       VARCHAR2(100)        NOT NULL,
    nazwisko   VARCHAR2(100)        NOT NULL,
    mail       VARCHAR2(100) UNIQUE NOT NULL,
    nrTelefonu VARCHAR2(100) UNIQUE NOT NULL,
    haszHasla  VARCHAR2(32)         NOT NULL
);

CREATE TABLE Klient
(
    idKonta             NUMBER(6) PRIMARY KEY REFERENCES Konto (id),
    poziomZaawansowania VARCHAR2(100) CHECK (poziomZaawansowania IN
                                             ('n/a', 'początkujący', 'średniozaawansowany', 'zaawansowany'))
);

CREATE TABLE Pracownik
(
    idKonta  NUMBER(6) PRIMARY KEY REFERENCES Konto (id),
    idBasenu NUMBER(6) NOT NULL REFERENCES Basen (id)
);

CREATE TABLE Rezerwacja
(
    id       NUMBER(6) PRIMARY KEY,
    idBasenu NUMBER(6) NOT NULL REFERENCES Basen (id),
    idKonta  NUMBER(6) NOT NULL REFERENCES Konto (id),
    nrToru   NUMBER(6) NOT NULL CHECK (nrToru > 0),
    czasOd   DATE      NOT NULL,
    czasDo   DATE      NOT NULL,
    liczbaOsob   NUMBER(6) DEFAULT 1 CHECK (liczbaOsob >= 0),
    czyRezerwacjaCalegoToru NUMBER(1) DEFAULT 0
);

CREATE OR REPLACE TRIGGER rezerwacjaToruNieKoliduje
    BEFORE INSERT OR UPDATE ON Rezerwacja
    FOR EACH ROW
    DECLARE
        ileNachodzi NUMBER;
    BEGIN
        SELECT COUNT(*) INTO ileNachodzi FROM Rezerwacja WHERE czasOd < :NEW.czasDo AND czasDo > :NEW.czasOd AND nrToru = :NEW.nrToru
        AND (czyRezerwacjaCalegoToru = 1 OR :NEW.czyRezerwacjaCalegoToru=1);
        IF ileNachodzi > 0 THEN
            raise_application_error(-20007, 'Kolizja z rezerwacją całego toru!');
        END IF;
END;

CREATE OR REPLACE TRIGGER dobryNrToru
    BEFORE INSERT OR UPDATE ON Rezerwacja
    FOR EACH ROW
DECLARE
    ileTorow NUMBER;
BEGIN
    SELECT iloscTorow INTO ileTorow FROM Basen WHERE Basen.id = :NEW.idBasenu;
    IF :NEW.nrToru > ileTorow THEN
        raise_application_error(-20001, 'Tor nie istnieje');
    END IF;
END;

CREATE OR REPLACE TRIGGER dobryCzas
    BEFORE INSERT OR UPDATE
    ON Rezerwacja
    FOR EACH ROW
DECLARE
    otwarteOd NUMBER;
    otwarteDo NUMBER;
    czasOd    NUMBER;
    czasDo    NUMBER;
BEGIN
    IF TO_CHAR(czasOd, 'DD-MM-YYYY') != TO_CHAR(czasDo, 'DD-MM-YYYY') THEN
        raise_application_error(-20002, 'Rezerwacja nie może obejmować więcej niż jednego dnia!');
    END IF;
    SELECT MIN(otwarteOd) INTO otwarteOd FROM CennikIGodzinyOtwarcia WHERE CennikIGodzinyOtwarcia.idBasenu = :NEW.idBasenu AND CennikIGodzinyOtwarcia.dzienTygodnia = TO_NUMBER(TO_CHAR(:NEW.czasOd, 'D'));
    SELECT MAX(otwarteDo) INTO otwarteDo FROM CennikIGodzinyOtwarcia WHERE CennikIGodzinyOtwarcia.idBasenu = :NEW.idBasenu AND CennikIGodzinyOtwarcia.dzienTygodnia = TO_NUMBER(TO_CHAR(:NEW.czasDo, 'D'));
    czasOd := TO_NUMBER(TO_CHAR(:NEW.czasOd, 'HH24')) * 60 + TO_NUMBER(TO_CHAR(:NEW.czasOd, 'MI'));
    czasDo := TO_NUMBER(TO_CHAR(:NEW.czasOd, 'HH24')) * 60 + TO_NUMBER(TO_CHAR(:NEW.czasOd, 'MI'));
    IF czasOd < otwarteOd THEN
        raise_application_error(-20003, 'Rezerwacja nie może zaczynać się przed otwarciem basenu!');
    END IF;
    IF czasDo > otwarteDo THEN
        raise_application_error(-20004, 'Rezerwacja nie może kończyć się po zamknięciu basenu!');
    END IF;
    IF MOD(czasOd, 60) != MOD(czasDo, 60) THEN
        raise_application_error(-20005, 'Rezerwacja musi mieć długość będącą wielokrotnością 1h!');
    END IF;
    IF MOD(czasOd, 60) != MOD(otwarteOd, 60) THEN
        raise_application_error(-20006, 'Rezerwacja musi zaczynać się o pełnych godzinach od otwarcia');
    END IF;
END;

CREATE OR REPLACE TRIGGER czyObostrzeniaSaZachowane
    BEFORE INSERT OR UPDATE
    ON Rezerwacja
    FOR EACH ROW
DECLARE
    maxLiczbaOsobNaTorze NUMBER;
    ileObecnieNaTorze NUMBER;
BEGIN
    SELECT maxLiczbaOsobNaTorze INTO maxLiczbaOsobNaTorze FROM ObostrzeniaSanitarne WHERE idBasenu = :NEW.idBasenu;
    SELECT COUNT(*) INTO ileObecnieNaTorze FROM Rezerwacja WHERE czasDo > :NEW.czasOd AND czasOd < :NEW.czasDo AND idBasenu = :NEW.idBasenu AND nrToru = :NEW.nrToru;
    IF ileObecnieNaTorze + :NEW.liczbaOsob > maxLiczbaOsobNaTorze THEN
        raise_application_error(-20007, 'Za dużo osób na torze!');
    END IF;
END;

CREATE TABLE RezerwacjaIndywidualna
(
    idRezerwacji NUMBER(6) PRIMARY KEY REFERENCES Rezerwacja (id),
    poziomZaawansowania VARCHAR2(100) CHECK (poziomZaawansowania IN
                                             ('początkujący', 'średniozaawansowany', 'zaawansowany'))
);
