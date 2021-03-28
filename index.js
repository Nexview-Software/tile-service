const express = require('express');
const cors = require('cors');
const MBTiles = require('@mapbox/mbtiles');
const p = require('path');
const app = express();
const port = 3000;

const headerFont = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/x-protobuf'
};

const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/x-protobuf',
    'Content-Encoding': 'gzip'
};

app.use(cors());

app.get('/radar/:site/:event/:product/:date/:z/:x/:y.pbf', (req, res) => {
    new MBTiles(p.join(__dirname, '../Map Components', 'radar', req.params.site, req.params.event, req.params.product, req.params.date + '.mbtiles?mode=ro'), (err, mbtiles) => {
        mbtiles.getTile(req.params.z, req.params.x, req.params.y, (err, tile, headers) => {
            if (err) {
                res.set({ 'Content-Type': 'text/plain' });
                res.status(404).send(`Tile rendering error: ${ err }\n`);
            } else {
                res.set(header);
                res.send(tile);
            }
        });
        if (err) {
            console.error('Error opening database');
        }
    });
});

app.get('/:source/:z/:x/:y.pbf', (req, res) => {
    new MBTiles(p.join(__dirname, '../Map Components', req.params.source + '.mbtiles?mode=ro'), (err, mbtiles) => {
        mbtiles.getTile(req.params.z, req.params.x, req.params.y, (err, tile, headers) => {
            if (err) {
                res.set({ 'Content-Type': 'text/plain' });
                res.status(404).send(`Tile rendering error: ${ err }\n`);
            } else {
                res.set(header);
                res.send(tile);
            }
        });
        if (err) {
            console.error('Error opening database');
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${ port }`);
});