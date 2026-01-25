
const Tour = require('./../models/tourModel.js')
const APIFeatures = require('./../utils/apiFeatures.js')

exports.aliasTopTours = (req,res,next) =>{
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage.price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}




exports.getAllTours = async (req,res)=>{
   try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
}

exports.getTourById = async (req,res)=>{
    try{
       const tour =  await Tour.findById(req.params.id);
        res.status(200).json({
            result : 'success',
            data:{
                tours : tour
            }
        })

    }
    catch(err){
        res.status(404).json({
      status: 'fail',
      message: err.message
    });
    }

}

exports.createTour = async (req,res)=>{
    try{
    //Tour is a model
    const newTour = await Tour.create(req.body);

    res.status(200).json({
        status: 'Success',
        data :{
            tour : newTour
        }
    })
}
catch(err){
    res.status(404).json({
        status:'Fail',
        message: err
    })
}



}
exports.updateTour = async (req,res)=>{
   try{
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
   }
   catch(err){
     res.status(404).json({
        status:'Fail',
        message: err
    })

   }
}

exports.deleteTour = async (req,res)=>{
    try{
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
        status:'success',
        data : null


    })
    }
    catch(err){
         res.status(404).json({
        status:'Fail',
        message: err
    })

    }

    

}

exports.getTourStats = async (req,res)=>{
    try{
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



    }catch(err){
         res.status(404).json({
        status:'Fail',
        message: err
    })
    }

}

exports.getMonthlyPlan = async (req,res)=>{
    try{
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


    }catch(err){
        res.status(404).json({
        status:'Fail',
        message: err
    })

    }

}