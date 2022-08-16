// Avec le framework express
const express = require("express");

// express app
const app = express();

// register view engine
app.set("view engine", "ejs");

// listen for requests
app.listen(3000);

app.get("/", (req, res) => {
    const blogs = [
        { title: "Yoshi finds eggs", snippet: "Lorem ipsum dolor sit amet consectetur" },
        { title: "Mario finds stars", snippet: "Lorem ipsum dolor sit amet consectetur" },
        { title: "Luigi finds nothing", snippet: "Lorem ipsum dolor sit amet consectetur" },
    ];
    //res.send("<p>home page</p>");
    res.render("index", { title: "Home", blogs });
});

app.get("/about", (req, res) => {
    //res.sendFile("./views/about.html", { root: __dirname });
    res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
    res.render("create", { title: "Create a new blog" });
});

// redirects
app.get("/about-us", (req, res) => {
    res.redirect("./about");
});

// 404 page -> Le code va s'executer de haut en bas et si l'url ne correspond pas aux autre fonctions cela va passer à celle d'en dessous, comme un "default" dans un switch case
app.use((req, res) => {
    //res.status(404).sendFile("./views/404.html", { root: __dirname })
    res.status(404).render("404", { title: "404" });
});