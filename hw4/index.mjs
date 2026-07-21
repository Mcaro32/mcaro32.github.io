import express from "express";

import si from "systeminformation";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/cpu", (req, res) => {
    res.render("cpu");
});

app.get("/memory", (req, res) => {
    res.render("memory");
});

app.get("/devices", (req, res) => {
    res.render("devices");
});

app.get("/tech-news", async(req,res) => {

const cpu = await si.cpu();
const memory = await si.mem();
const os = await si.osInfo();

const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");

const storyIds = await response.json();

const stories = [];

for (let i = 0; i < 5; i++) {

        const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`
        );

        const story = await storyResponse.json();

        stories.push(story);
    }

    res.render("tech-news", {

        title: "Tech News",

        currentPage: "tech-news",

        cpu,

        memory,

        os,

        stories

    });

});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});