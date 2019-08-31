const fs = require('fs')
const multer = require('multer');
const { AbortController} = require('abortcontroller-polyfill/dist/cjs-ponyfill');
const csv = require('fast-csv');
const fileStream = fs.createReadStream("data/date.csv");
const parser = csv.parse();
var upload = multer();



function toTimestamp(strDate){
    var datearray = strDate.split("/");
    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    var datum = Date.parse(newdate);
    return datum/1000;
   }

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "data/uploads/");
    },
    filename: function(req, file, callback) {
        req._originalname = file.fieldname +  "_" + Date.now() + "_" + file.originalname;
        callback(null, req._originalname);
    }
});

var upload = multer({
    storage: Storage
}).single("file");

var read_db = function(req, cb){
    console.log(toTimestamp(req.query.start_date));
    var export_data = [];
     fileStream
            .pipe(parser)
            .on('error', error => console.error(error))
            .on('readable', () => {
            for (let row = parser.read(); row; row = parser.read()) {
                    if(toTimestamp(row[0])>toTimestamp(req.query.start_date)){
                        export_data.push(row);
                    }
                }
            })
            .on('end', (rowCount) => {
                console.log(`Parsed ${rowCount} rows`);
                cb(JSON.stringify(export_data));
                // return JSON.stringify(export_data);
        }); 
};

var read_json= function(req, cb){   
    var new_teams = "";
    for(var i=0;i<req.body.length;i++){
        var obj = req.body[i];
        new_teams += JSON.stringify(obj) + "\n";
        if( i == req.body.length-1){
            cb(new_teams);
        }
    }
    
}

exports.upload_func = (req, res) => {
    const controller = new AbortController();
    req.on('close', err => { // if the request is closed from the other side
        controller.abort(); // abort our own requests
        try {
            fs.unlinkSync("data/uploads/" + req._originalname)
            //file removed
          } catch(err) {
            console.error(err)
          }
      })
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    })
};

exports.export_func = (req,res) => {
    const controller = new AbortController();
    req.on('close', err => { // if the request is closed from the other side
        console.log("Aborting.")
        controller.abort(); // abort our own requests
      })
    read_db(req, function(data, err){
        if(err) {
            return res.end("Something went wrong!");
        }
        res.status(200).send(data);
        
    });
};

exports.createteam_func = (req,res) => {
    const controller = new AbortController();
    req.on('close', err => { // if the request is closed from the other side
        console.log("Aborting.")
        controller.abort(); // abort our own requests
      })
      read_json(req, function(data, err) {
        fs.appendFileSync('data/teams.txt',data);
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("Created Successfully");
    })
};