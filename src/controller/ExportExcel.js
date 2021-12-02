
const excelJS = require("exceljs");
const sequelize_instance = require("../config/pg_connect");
let User = require('../model/Users')
const path = require('path')

const list_map_table = []



const Sequelize  = require('sequelize')
const sequelize = new Sequelize('fpdemo', 'postgres', '123',{
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  })
  
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

    sequelize.getQueryInterface().showAllTables().then((all) => {
        console.log(all)
    });
  

// sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
//     console.log('// Tables in database','==========================');
//     console.log(tableObj);
// })
// .catch((err) => {
//     console.log('showAllSchemas ERROR',err);
// })



let columns_f = []
let cl = 1
for( let key in User.rawAttributes ){
    
    columns_f.push(
        { header: key.toLocaleUpperCase(), key: key , width: 12}, 
    )
}

// User.rawAttributes.map((item, index) => {
//     if( index %2 == 0 ) ww = 10
//     else ww=20
//     console.log('ww: ', ww)
//     return columns_f.push(
//         { header: item.toLocaleUpperCase(), key: item , width: ww }, 
//     )
// })


const exportUser = async (req,res) => { 

  let data_return = req.body
  console.log("export", req.body)

  const workbook = new excelJS.Workbook();  // Create a new workbook
  const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
  const path = "./files";  // Path to download excel
  
    // let {type, fileName} = req.body
    // console.log('adsad', type, fileName)
    worksheet.columns = columns_f

    // Looping through User data
    let counter = 1;
    let data = data_return.data_body
    data.forEach((user) => {
        user.uid = counter;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    await workbook.xlsx.writeFile(`./${data_return.sub.file_name}.${data_return.sub.type_f}`)
    .then(() => {
        console.log('thanh cong')
         res.json({
           status: "success",
           message: "file successfully Export",
           path: `${path}/${data_return.sub.file_name}.${data_return.sub.type_f}`,
          });
    })
    .catch(err =>{
      res.json({
        status: "Failure!!!",
        message: "Fail to export file",
        path: `${path}/${data_return.sub.file_name}.${data_return.sub.type_f}`,
      })
    })
   
};


module.exports = exportUser;



