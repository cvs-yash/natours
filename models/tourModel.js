const mongoose = require('mongoose')
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true , "A Tour must have name"],
        unique: true,
        trim: true,
        maxlength: [40,"A tour must have less than or  equal to 40 characters"],
        minlength: [10, "A tour must have less than or  equal to 10 characters"]
    },
    slug : String,
    
    duration:{
        type: Number,
        required: [true, "A Tour must have duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true,"A Tour must have a group"]
    },
    difficulty: {
        type: String,
        required: [true, "A Tour must have a difficulty"],
        enum:{
            values: ["easy","medium","difficult"],
            message: "Difficulty is either easy , medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min : [1, "Rating must be above 1.0"],
        max : [5,'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have price"],
    },
    priceDiscount: Number ,
    summary: {
        type: String,
        trim: true,
        required: [true, "ATour must have description"]
    },
    description:{
        type: String,
        trim: true,
        
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have cover image "]
    },
    image: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour :{
        type : Boolean,
        default: false
    },
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7
})

//Document middleware : runs before  .save() and .create()  .insertMany()
tourSchema.pre('save',function(next){   //this function will be called before the actual document is saved to the database
    this.slug = slugify(this.name, { lower: true})
    next()
})

// tourSchema.pre('save',function(next){
//     console.log('will save document ....')
//     next()
// })

// tourSchema.post('save',function(doc,next){
//     console.log(doc)
//     next()
// })

//QUERY MIDDLEWARE

//query should execute if it starts with ^find
tourSchema.pre(/^find/,function(next){     //mongodb return the  documents without secretTour
    this.find({secretTour: {$ne: true}})
    next()
})

// tourSchema.pre('findOne',function(next){    
//     this.find({secretTour: {$ne: true}})
//     next()
// })

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift( {$match:{ secretTour: {$ne: true } } } )
    console.log(this.pipeline())
    next()
})
const Tour = mongoose.model("Tour" , tourSchema)

module.exports = Tour