const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const dbName = 'ExpencesDatabase';
mongooseURL=`mongodb+srv://admin:Entropia1@cluster0.193v2.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(mongooseURL);
const db = mongoose.connection;
db.on('error', (err)=> console.error(error));
db.once('open', (err)=> console.log('Connected to database'));

const Schema = mongoose.Schema;
const newDay = new Schema({
  id: {type: String, default: 'expences'},
  money: {type:Number, default: 900},
  moneyConstant: {type:Number, default: 900},
  counter: {type: Number, default: 13},
  day:{ type: Number, default: 25},
  month:{ type: Number, default: 10},
  year:{ type: Number, default: 2021},

  food: {type: Number, default: 0},
  fuel: {type: Number, default: 0},
  alcohol: {type: Number, default: 0},
  medicines: {type: Number, default: 0},
  bills: {type: Number, default: 0},
  clothes: {type: Number, default: 0},
  entertainment: {type: Number, default: 0},
  chemicals: {type: Number, default: 0},

  foodMonth: {type: Number, default: 0},
  fuelMonth: {type: Number, default: 0},
  alcoholMonth: {type: Number, default: 0},
  medicinesMonth: {type: Number, default: 0},
  billsMonth: {type: Number, default: 0},
  clothesMonth: {type: Number, default: 0},
  entertainmentMonth: {type: Number, default: 0},
  chemicalsMonth: {type: Number, default: 0}
});
const dayModel = (mongoose.model('day', newDay));

const app = express();
app.use(express.static(
  path.join(__dirname, 'public')
));
app.use(express.json());

app.get('/getdata', async (req, res)=>{
  const actualDate = new Date();
  const actualDay = actualDate.getDate();
  const actualMonth = actualDate.getMonth() + 1;
  const actualYear = actualDate.getFullYear();

  const data = await dayModel.findOne({id: 'expences'});
  const dateData = { actualDay, actualMonth, actualYear };
  const { counter, day, month, money, year } = data;
  
  const dateFromDB = new Date(`${month}/${day}/${year}`);
  const difference = actualDate.getTime() - dateFromDB.getTime();
  const differenceDays = (Math.ceil(difference / (1000 * 3600 * 24))) - 1;
  
  //jeśli jest ten sam dzień, zwróć zaktualizowane dane
  if(counter === differenceDays) return res.json([data, dateData]);

  //jeśli jest nowy miesiąc rozliczeniowy, aktualizuj
  if(differenceDays > 27){
    let temporaryActualMonth = null
    if(actualDay >= 25){
      temporaryActualMonth = actualMonth;
    }else if(actualDay < 25){
      temporaryActualMonth = actualMonth - 1;
    };
    const temporaryInitialDate = new Date(`${temporaryActualMonth}/25/${year}`);
    const temporaryDifference = actualDate.getTime() - temporaryInitialDate.getTime();
    const temporaryDifferenceDays = (Math.ceil(temporaryDifference / (1000 * 3600 * 24))) - 1;
    await dayModel.findOneAndUpdate(
      {
        id: 'expences'
      },{
        counter: temporaryDifferenceDays,
        month: temporaryActualMonth,
        year: actualYear,
        money: 2850,
        moneyConstant: 2850,
        food: 0,
        fuel: 0,
        alcohol: 0,
        medicines: 0,
        bills: 0,
        clothes: 0,
        entertainment: 0,
        chemicals: 0,
        foodMonth: 0,
        fuelMonth: 0,
        alcoholMonth: 0,
        medicinesMonth: 0,
        billsMonth: 0,
        clothesMonth: 0,
        entertainmentMonth: 0,
        chemicalsMonth: 0
    });
    const data = await dayModel.findOne({id: 'expences'})
    res.json([data, dateData]);
  }else {
    //jeśli jest nowy dzień, zaktualizuj dane
    await dayModel.findOneAndUpdate(
      {
        id: 'expences'
      },{
        counter: differenceDays,
        moneyConstant: money,
        food: 0,
        fuel: 0,
        alcohol: 0,
        medicines: 0,
        bills: 0,
        clothes: 0,
        entertainment: 0,
        chemicals: 0
      });
    const data = await dayModel.findOne({id: 'expences'})
    res.json([data, dateData]);
  };
});

//   if(differenceDays > 27){
//       if(actualDay >= 25){
//         const temporaryInitialDate = new Date(`${actualMonth}/25/2021`);
//         const temporaryDifference = actualDate.getTime() - temporaryInitialDate.getTime();
//         const temporaryDifferenceDays = (Math.ceil(temporaryDifference / (1000 * 3600 * 24))) - 1;
//         await dayModel.findOneAndUpdate(
//           {
//             id: 'expences'
//           },{
//             counter: temporaryDifferenceDays,
//             month: actualMonth,
//             year: actualYear,
//             money: 2850,
//             moneyConstant: 2850,
//             food: 0,
//             fuel: 0,
//             alcohol: 0,
//             medicines: 0,
//             bills: 0,
//             clothes: 0,
//             entertainment: 0,
//             foodMonth: 0,
//             fuelMonth: 0,
//             alcoholMonth: 0,
//             medicinesMonth: 0,
//             billsMonth: 0,
//             clothesMonth: 0,
//             entertainmentMonth: 0
//           });
//         const data = await dayModel.findOne({id: 'expences'})
//         res.json([data, dateData]);
//       }else if(actualDay < 25){
//         const temporaryInitialDate = new Date(`${actualMonth - 1}/25/2021`);
//       }
//     }else {
//       //jeśli jest nowy dzień, zaktualizuj dane
//       await dayModel.findOneAndUpdate(
//         {
//           id: 'expences'
//         },{
//           counter: differenceDays,
//           moneyConstant: money,
//           food: 0,
//           fuel: 0,
//           alcohol: 0,
//           medicines: 0,
//           bills: 0,
//           clothes: 0,
//           entertainment: 0,
//         });
//     const data = await dayModel.findOne({id: 'expences'})
//     res.json([data, dateData]);
//   };
// });

app.post('/update', async (req, res)=>{
  const { sum, sumMonth, type, typeMonth, moneyMinusValue } = req.body;
  await dayModel.findOneAndUpdate(
    {
      id: 'expences'
    },{
      [type]: sum,
      [typeMonth]: sumMonth,
      money: moneyMinusValue,
    });
  const data = await dayModel.findOne({id: 'expences'})
  res.json([data, null]);
})

// new dayModel({
// }).save();

const serverPort = process.env.PORT || 8080;
app.listen(serverPort);