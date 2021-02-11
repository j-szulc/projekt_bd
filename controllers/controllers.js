const saySomething = (req, res, next) => {
    res.status(200).json({
        body: 'Hello from Heroku!',
    });
};

const pools = (req,res,next) => {
    res.status(200).json({
        rows: [[2, 'morsowanie nad Bałtykiem', 'Bałtycka 69'],
        [3,'morsowanie na mokotowskim','Pole Mokotowskie 42']]
    });
}

const login = (req,res,next) => {
    res.status(200).json({
        success: true
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