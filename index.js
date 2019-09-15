var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://khoapham:awhXY2Ns2nhuC7mi@cluster0-qah5q.mongodb.net/buoi7?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Mongodb connect error!!! " + err);
    }else{
        console.log("Mongodb connected successfully.");
    }
});

app.get("/", function(req, res){
    res.render("trangchu");
});

app.get("/admin", function(req, res){
    res.render("admin");
});


//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var Cap1 = require("./models/cap1");
var Cap2 = require("./models/cap2");

app.post("/cap1", function(req, res){
    var TheThao = new Cap1({
        name: req.body.name,
        mang: []
    });
    TheThao.save(function(err){
        if(err){ 
            console.log("Save Cap1 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("Saved Cap1 successfully."); 
            res.json({kq:1});
        }
    });
});

app.post("/cap2", function(req, res){

    var BongDa = new Cap2({
        name: req.body.name
    });

    BongDa.save(function(err){
        if(err){ 
            console.log("Save Cap2 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("Saved Cap2 successfully."); 
            Cap1.findOneAndUpdate(
                {_id: req.body.id1}, 
                { $push: {mang:BongDa._id} }, 
                function(err){
                    if(err){ 
                        console.log("Update mang Cap1 error: " + err); 
                        res.json({kq:0});
                    }
                    else{ 
                        console.log("Updated mang Cap1 successfully."); 
                        res.json({kq:1});
                    }
                }
            );
        }
    });

});

app.post("/list/cap1", function(req, res){

    Cap1.aggregate([{
        $lookup: {
            from:           'cap2',
            localField:     'mang',
            foreignField:   '_id',
            as: 'danhsach'
        }
    }], function(err, mang){
        if(err){ 
            console.log("List Cap1 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("List Cap1 successfully."); 
            res.json({kq:1, ds:mang });
        }
    });

});





