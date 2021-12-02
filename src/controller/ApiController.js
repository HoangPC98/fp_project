
let Users = require('../model/Users')
let UserFpMonths  = require('../model/UserFpMonths')
let Remotes = require('../model/Remotes')

function GetAllUser(req,res,next) {
    console.log('GetAllUsers hahahha')
    User.findAll({}).then(data => {
        console.log('DATA ALL USER...', data);
        res.json(data)
    })
}

const Statistic = require('../controller/Statistic')
async function FetchStatistic(req,res){
    console.log('okoko')
    await Statistic.FetchStatistic(req.body.key, req.body.value)
    let data = await UserFpMonth.findAll({})
    await console.log('alooo...', data)
    await res.json(data)
}

function RemoteIO(req,res){
    console.log(' REMOTes okoko', req.body)
    Remotes.findOne({where: {uid: req.body.uid, day: req.body.day}})
    .then(data =>{  
        if(!data){
            return Remote.create({uid: req.body.uid, day: req.body.day,  checkin: req.body.cico})
            .then(data => {
                console.log('dataa')
                res.json(data)
            })
        }
        else{
            if(!data.done_status){
                if(!data.checkout){
                    data.update({checkout: req.body.cico, done_status : true})
                    .then(result => {
                        console.log('DOne ')
                        res.send(result)
                    })
                    .catch(err => console.log('err update',err))
                }
                else
                    return res.send('DOne rooif ma')
            }
            else
                return res.send('DOne rooif ma')
        
        }
       
    })
    .catch(err => console.log('err find',err));
}   

module.exports = {GetAllUser, FetchStatistic, RemoteIO}
// GetAllUser()