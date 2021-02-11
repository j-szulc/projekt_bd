const { Client } = require('pg');

const connectionString = "postgres://mxglhcboagvgvj:b9f2e8bea188f251f3e7e8cceed8de634d54242262b8da4ab72b53751ef9b3c3@ec2-54-247-158-179.eu-west-1.compute.amazonaws.com:5432/decevmqg3i24kn"

const client = new Client({
    connectionString: connectionString,
    //connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = client;