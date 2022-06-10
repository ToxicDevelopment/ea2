const express    = require('express');
const fileUpload = require('express-fileupload');
const rateLimit  = require('express-rate-limit');

const bodyParser = require('body-parser');
const fs         = require('fs');

const app = express();

const public = __dirname + '/Public/';
const private = __dirname + '/Private/';

const port = 3000;

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    leagacyHeaders: false
})

// Set

app.set('port', process.env.PORT || port);

// Use

app.use(express.static(public));
app.use(bodyParser.urlencoded({ extended: true, limit: "512mb" }));
app.use(fileUpload());
app.use(limiter)

// Get

app.get('/', (req, res) => {
    res.sendFile(public + 'index.html');
});

app.get('/upload', (req, res) => {
    res.sendFile(public + 'upload.html');
});

app.get('/about', (req, res) => {
    res.sendFile(public + 'about.html');
});

app.get('/file', (req, res) => {
    const id = req.query.id;

    if(!fs.existsSync(private + 'Files/' + id)) {
        res.status(404).send('File not found');
    } else {
        fs.readdir(private + 'Files/' + id, (err, files) => {
        const fileName = files[0];
        let content = fs.readFileSync(private + 'Files/' + id + '/' + fileName, error).toString();

        content = content.replaceAll('\n', '<br>');

        res.send(`
                <link rel="stylesheet" href="code.css">

                <title>${fileName}</title>

                <h1>${fileName}</h1>
                <pre><code>${content}</code></pre>
                 `);      
    });   
    }
});

// Post

app.post('/upload', (req, res) => {
    let id = Math.random() * Number.MAX_SAFE_INTEGER;

    id = Math.floor(id);

    const file = req.files.file;

    fs.mkdir(private + 'Files/' + id, error);

    fs.writeFile(private + 'Files/' + id + '/' + file.name, file.data, error);
    
    res.writeHead(301, { Location: `/file?id=${id}` }).end();
});

app.post('/search', (req, res) => {
    const id = req.body.id;

    res.writeHead(301, { Location: `/file?id=${id}` }).end();
});

// Listen

app.listen(port, () => {
    console.log('ServerShare Has Started.');
});

// Functions

function error(err) {
    console.log(error);
}

// Note to amsquid. We need to make a login system for purchased skripts and plugins and builds.