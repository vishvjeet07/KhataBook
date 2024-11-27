const express = require('express');
const app = express();
const path = require('path');
const Uploads = path.join(__dirname,'files');

const fs = require('fs');
app.set("view engine","ejs");

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const currentDate = new Date();
const date = `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`
let reckoning;
let newContent;
let num = 0;

app.get('/',(req,res)=>{
    fs.readdir(Uploads,(err, files) => {
        if (err) throw err;
        res.render("index",{files});
    });
});


app.get('/createhisab',(req,res)=>{
    // if(fs.existsSync(`./files/${date}.txt`)){
    //     res.redirect('/')
    // }
    // else{
    //     res.render("createhisab");
    // }
    res.render("createhisab");
});
app.post('/submit' , (req , res)=>{
        reckoning = req.body.reckoning;
        reckoning = reckoning.replace(/(\r\n|\n|\r)/g, '<br>');
        const fn = `${date}.txt`;
        if(num == 0){
            fs.writeFile(`./files/${fn}`,reckoning,function(err){
                num++;
                if(err) return res.send("semething went wrong");
            });
            // res.send(`your reckoning <br/> ${reckoning}`);
            console.log(num);
            res.redirect('/');
        }
        else if(num > 0){
            fs.stat(`./files/${fn}`,(err,stats)=>{
                if(err) console.log(err);
                
                if(stats.isFile()){

                    fs.writeFile(`./files/(${num})${fn}`,reckoning,function(err){
                        if(err) return res.send("semething went wrong");
                    });
                    // res.send(`your reckoning <br/> ${reckoning}`);
                    num++;
                    res.redirect('/');
                }
                    });
                }


});


app.get('/read/:filename', (req, res) => {
    const filePath = path.join(Uploads, req.params.filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("File not found or cannot be read.");
        }
        
        res.render("show",{filename:req.params.filename, data});
    }); 
});

app.get('/edit/:filename',(req,res)=>{
    const filename = req.params.filename;
    const filePath = path.join(__dirname,'files',filename);

    const currentDate = new Date();
    // const day = String(currentDate.getDay()).padStart(2,'0');
    // const month = String(currentDate.getMonth()).padStart(2,'0');
    // const year = currentDate.getFullYear();
    let lastEdit = `${date}`;

    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err) {
            console.log("error detecting file");
        }
        else{
            res.render('edit',{filename,lastEdit,content:data});
        }
    });
});
app.post('/edit/:filename',(req,res)=>{
    newContent = req.body.thecontent;
    const filename = req.params.filename;
    const filePath = path.join(__dirname,'files',filename);
    
    fs.writeFile(filePath,newContent,function(err){
        if(err) return res.send("semething went wrong");
        res.redirect('/');
    });
});

app.get('/delete/:filename',(req,res)=>{
    const filePath = path.join(Uploads, req.params.filename);
    fs.unlink(filePath,(err)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(3000);