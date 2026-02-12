
const Tour = require('./../models/tourModel.js')
const APIFeatures = require('./../utils/apiFeatures.js')
const catchAsync = require('./../utils/catchAsync.js')

exports.aliasTopTours = (req,res,next) =>{
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage.price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}



exports.getAllTours = catchAsync(async (req,res,next)=>{
    //build query
    // const queryObj = {...req.query};
    // const exculdedFields = ['page' , 'sort' , 'limit' , 'fields'];
    // exculdedFields.forEach(el =>delete queryObj[el])
       

    // //advance filtering
    // let queryStr = JSON.stringify(queryObj)
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match=> `$${match}`);
    // let query = Tour.find(JSON.parse( queryStr));

    //sorting

    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ')
    //     query=query.sort(sortBy)
    // }else{
    //    query =  query.sort('-createdAt')
    // }

    //limit
    // if(req.query.fields){
    //     const fields = req.query.fields.split(',').join(' ')
    //     query=query.select(fields)
    // }else{
    //     query=query.select('-__v')
    // }

    //pagination
    // const page = req.query.page * 1 || 1
    // const limit = req.query.limit * 1 || 100
    // const skip = (page-1)*limit

    // query = query.skip(skip).limit(limit)

    // if(req.query.page){
    //     const numTours = await Tour.countDocuments()
    //     if(skip>=numTours) throw new Error("This page is  not found")
    // }

    //execute query
    const features = new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const tours = await features.query;
    //send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours
      }
    });
  
})

exports.getTourById = catchAsync( async (req,res,next)=>{
    
       const tour =  await Tour.findById(req.params.id);
        res.status(200).json({
            result : 'success',
            data:{
                tours : tour
            }
        })

})



exports.createTour = catchAsync(async (req,res,next)=>{
    const newTour = await Tour.create(req.body);
    res.status(200).json({
        status: 'Success',
        data :{
            tour : newTour
        }
    })
})
exports.updateTour = catchAsync( async (req,res,next)=>{
   
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new : true ,
        runValidators : true

    });
    res.status(200).json({
        status: 'Success',
        data :{
            tour 
        }
    })

})

exports.deleteTour = catchAsync(async (req,res,next)=>{
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
        status:'success',
        data : null

    })
    
})

exports.getTourStats =  catchAsync(async (req,res,next)=>{
   
        const stats = await Tour.aggregate([
            {
            $match: {ratingsAverage: {$gte: 4.5}}
            },
            { 
                $group: {     //groups the objects
                    _id: '$difficulty',
                    numTours: { $sum: 1},
                    numRatings: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price'},


                }
            },
            {
                $sort: { avgPrice : 1 }
            },
            // {
            //     $match: { _id: {$ne: 'easy'}}
            // }
            
        ])
         res.status(200).json({
        status:'success',
        data : {
            stats
        }


    })

})

exports.getMonthlyPlan =  catchAsync(async (req,res,next)=>{
   
        const year = req.params.year * 1 //2021
        const plan = await Tour.aggregate([
            {
                $unwind :  '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
                
            },
            {
               $group :{
                _id: { $month : '$startDates'},
                numToursStarts : { $sum: 1},
                tours: { $push: '$name'},
               } 
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project:{
                    _id : 0
                }
            },
            {
                $sort: {numToursStarts: -1}
            },
            {
                $limit: 12
            }
        ])



        res.status(200).json({
        status:'success',
        data : {
            plan
        }
        })



})