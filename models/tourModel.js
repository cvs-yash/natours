const mongoose = require('mongoose')
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true , "A Tour must have name"],
        unique: true,
        trim: true
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
        required: [true, "A Tour must have a difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
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
},{
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


const Tour = mongoose.model("Tour" , tourSchema)

module.exports = Tour