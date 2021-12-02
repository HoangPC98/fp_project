let FpMonth = require('../model/FpMonths')
let UserFpMonth  = require('../model/UserFpMonths')
let User = require('../model/Users')

let UserFpOnday = require('../model/FpDays')

async function FetchStatistic(key, value){
    console.log('Fetching', key, value)
    if(key === 'date') 
        flag = 'uid'
    else if (key === 'uid') 
        flag = 'date'   
    condition = {}
    condition[key] = value
    console.log('condition...',condition)
    await UserFpMonth.destroy({where: {}, truncate: true})

    let filter_data = await FpMonth.findAll({ where: condition, order:[['uid', 'ASC'], ['date_time', 'ASC']] })
    let list_cico = []
    // let list_cico = [filter_data[0].dataValues.date_time]
    for(let i = 0; i< filter_data.length-1 ; i++){
        list_cico.push(filter_data[i].dataValues.date_time)   
            if(filter_data[i].dataValues[flag] != filter_data[i+1].dataValues[flag]){
                console.log('IFF listcico', list_cico)
                last_co = list_cico.length > 1 ? list_cico[list_cico.length-1] : null
                w_time = list_cico[list_cico.length-1].getTime() - list_cico[0].getTime()
                console.log('last CO', last_co)
                let newUserData = {
                    uid: filter_data[i].dataValues.uid,
                    date: filter_data[i].dataValues.date,
                    list_cico_onday: list_cico,
                    first_ci: list_cico[0],
                    last_co: last_co,
                    wtime: w_time,
                    work_hours: w_time/(3600*1000)
                }
                console.log('newUserData...cheching...', newUserData)
                await UserFpMonth.create(newUserData).then(reslut=>{
                    console.log('carate...', reslut)
                })
                .catch(error=>{
                    console.log('err',error)
                })
                list_cico = []
            }
    }

  
}


module.exports = {FetchStatistic}


