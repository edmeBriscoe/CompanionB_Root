var mongo = require('mongodb');
console.log("calling server.js file")
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

//var server = new Server('localhost', 27017, { auto_reconnect: true });
var server = new Server('mongodb://CoreCompanion:CoreCompanion2016!@cluster0-shard-00-00-31rcd.mongodb.net:27017,cluster0-shard-00-01-31rcd.mongodb.net:27017,cluster0-shard-00-02-31rcd.mongodb.net:27017/admin?ssl=false&replicaSet=Cluster0-shard-0', { auto_reconnect: true });
db = new Db('readingcompanion', server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'readingcompanion' database");
        db.collection('studentdetails', { strict: true }, function (err, collection) {
            if (err) {
                console.log("The 'studentdetails' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

//var MongoClient = require('mongodb').MongoClient
//  , assert = require('assert');

//// Connection URL
//var url = 'mongodb://CoreCompanion:CoreCompanion2016!@cluster0-shard-00-00-31rcd.mongodb.net:27017,cluster0-shard-00-01-31rcd.mongodb.net:27017,cluster0-shard-00-02-31rcd.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0';
////var url = 'mongodb://heroku_1dlsl704:22173vhgcphfvpen961uggi689@ds023074.mlab.com:23074/heroku_1dlsl704';
//// Use connect method to connect to the Server
//MongoClient.connect(url, function (err, db) {
//    assert.equal(null, err);
//    console.log("Connected correctly to server");

//    db.close();
//});

exports.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving student details: ' + id);
    db.collection('studentdetails', function (err, collection) {
        collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function (req, res) {
    db.collection('studentdetails', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.addSd = function (req, res) {
    var sd = req.body;
    console.log('Adding studentdetails: ' + JSON.stringify(sd));
    db.collection('studentdetails', function (err, collection) {
        collection.insert(sd, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateSd = function (req, res) {
    var id = req.params.id;
    var sd = req.body;
    console.log('Updating studentdetails: ' + id);
    console.log(JSON.stringify(sd));
    db.collection('studentdetails', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(id) }, sd, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating studentdetails: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(sd);
            }
        });
    });
}

exports.deleteSd = function (req, res) {
    var id = req.params.id;
    console.log('Deleting studentdetails: ' + id);
    db.collection('studentdetails', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function () {

    var sd = [
    {
        contextGrp1:"7De",
        questionId:"CA1A1",
        score1:0,
        studentResponse1:"birthday",
        contextGrp2:"7De",
        score2:1,
        studentResponse2:"He had been"
    }];

    db.collection('studentdetails', function (err, collection) {
        collection.insert(sd, { safe: true }, function (err, result) { });
    });

};