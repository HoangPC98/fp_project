const Sequelize = require('sequelize')
let sequelize = require('../config/pg_connect')

const FpMonth = sequelize.define('fpmonth', {
    uid: {type: Sequelize.INTEGER},
    day: {type: Sequelize.INTEGER},
    cico_date_time: {type: Sequelize.DATE},
})

FpMonth.sync().then(() => {
    console.log('AsyncFPOn  MONTH... => Success')
});

module.exports = FpMonth