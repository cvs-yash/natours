
const fs = require('fs');


const tours = JSON.parse (
    fs.readFileSync(`${__dirname}/../dev-data/data/tour-simple.json`)
)

exports.getAllUsers = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message:'this route is not implemented yet..'

    })

}
exports.getUserById = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message:'this route is not implemented yet..'

    })

}
exports.createUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message:'this route is not implemented yet..'

    })

}

exports.updateUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message:'this route is not implemented yet..'

    })

}
exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message:'this route is not implemented yet..'

    })

}