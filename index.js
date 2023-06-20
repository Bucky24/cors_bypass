const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 9090;

const app = express();
app.use(cors());
app.use(bodyParser.raw({
    type: '*/*',
}));

app.get("/api", (req, res) => {
    const url = req.query.url;
    delete req.headers.host;
    delete req.headers.referer;
    delete req.headers['user-agent'];

    console.log(`Got GET call to ${url} with`, req.headers);

    fetch(url, {
        method: "GET",
        headers: req.headers,
    }).then((response) => {
        if (!response.ok) {
            response.text().then((text) => {
                console.log(`Fail for ${url}`);
                res.status(response.status).end(text);
            })
        } else {
            response.json().then((result) => {
                console.log(`Success for ${url}`);
                res.json(result).end();
            });
        }
    });
});

app.post("/api", (req, res) => {
    const url = req.query.url;
    delete req.headers.host;
    delete req.headers.referer;
    delete req.headers['user-agent'];
    const body = req.body;

    console.log(`Got POST call to ${url} with`, req.headers, "and body", req.body.toString());

    fetch(url, {
        method: "POST",
        headers: req.headers,
        body,
    }).then((response) => {
        if (!response.ok) {
            response.text().then((text) => {
                console.log(`Fail for ${url}`);
                res.status(response.status).end(text);
            })
        } else {
            response.json().then((result) => {
                console.log(`Success for ${url}`);
                res.json(result).end();
            });
        }
    });
});

app.get("/fetch.js", (req, res) => {
    const fetchPath = path.join(__dirname + "/fetch.js");
    let contents = fs.readFileSync(fetchPath, "utf8");
    let protocol = req.protocol;
    const host = req.get('host');
    if (host.includes("heroku")) {
        protocol = "https";
    }
    const base = protocol + '://' + host;
    contents = contents.replace("<<BASE>>", base);

    res.header("Content-Type", "text/javascript");
    res.send(contents);
});

app.get("/", (req, res) => {
    const base = req.protocol + '://' + req.get('host');
    res.send("To use, add <br><pre>&lt;script src=\"" + base + "/fetch.js\"&gt;&lt;/script&gt;</pre><br>To your head tag, then use fetch as normal");
})

app.listen(PORT, () => {
    console.log("Listening!");
});