// For more details see mongoose documentation and Scotch.io article "Easily Develop Node.js and MongoDB Apps with Mongoose"
//MB: I am allowing Mongo to handle creating the _id on the server-side, but commented out a line below incase we want to do it here. In essence _id is a learning session identifier
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var scoreSchema = new Schema({
//    email: { type: String, trim: true, lowercase: true },
//    score: [
//        {
//            email: String,
//            questionId: String,
//            contextGrp1: String,
//            score1: Number,
//            studentResponse1: String,
//            contextGrp2: String,
//            score2: Number,
//            studentResponse2: String
//        }
//    ],
//    created: { type: Date, default: Date.now },
//    update: { type: Date, default: Date.now },
//},
//    { collection: 'scores' }
//);

//scoreSchema.index({ email: 1 }, { unique: true });
//scoreSchema.index({ _id: 1 }, { unique: true });

console.log('In jjj routes.js.');


var ItemSchema = new Schema({
    email: { type: String, trim: true, lowercase: true },
            questionId: String,
            contextGrp1: String,
            score1: Number,
            studentResponse1: String,
            contextGrp2: String,
            score2: Number,
            studentResponse2: String,
    created: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now }
});

//itemSchema.index({ email: 1 }, { unique: false });
var Items = mongoose.model('Items', ItemSchema);

//module.exports = Scores;
module.exports = Items;