//Dependency const
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

//Asynch processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Server Setup
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Static Middleware
app.use(express.static("./Develop/public"));

// outing
module.exports = (app) => {
    
    //API GET request
    app.get("/api/notes", function(req,res){
        readFileAsync("./Develop.json", "utf8").then(function(data){
            notes = [].concat(JSON.parse(data))
            res.json(notes);
        })
    });

    //API POST request
    app.post("/api/notes", function(req, res){
        const note = req.body;
        readFileAsync("./Develop/db/db.json", "utf8").then(function(data){
            const notes =[].concat(JSON.parse(data));
            note.id = notes.length +1
            notes.push(note);
            return notes
        }).then(function(notes){
            writeFileAsync("./Develop/db/db.json", JSON.stringify(notes))
            res.json(note);
        })
    });

    //API DELETE request
    app.delete("/api/notes/:id", function(req, res){
        const idDelete = parseInt(req.params.id);
        readFileAsync("./Develop/db/db.json", "utf8").then(function(data){
            const notes = [].concat(JSON.parse(data));
            const newNotesData = []
            for (let i=0; i<notes.length; i++) {
                if(idDelete !== notes[i].id) {
                    newNotesData.push(notes[i])
                }
            }
            return newNotesData
        }).then(function(notes){
            writeFileAsync("./Develop/db/db.json", JSON.stringify(notes))
            res.send('successful save!')
        })
    })


    //HTML Routes
    app.get("/notes", function(req,res) {
        res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
    });

    app.get("/", function(req,res) {
        res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
    });

    app.get("*", function(req,res) {
        res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
    });

};

// Listening
app.listen(PORT, function() {
    console.log("App listening on PORT" + PORT);
});



