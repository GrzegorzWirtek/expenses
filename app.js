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

  food: {type: Number, default: 32},
  fuel: {type: Number, default: 0},
  alcohol: {type: Number, default: 20},
  medicines: {type: Number, default: 0},
  bills: {type: Number, default: 0},
  clothes: {type: Number, default: 50},
  entertainment: {type: Number, default: 0},
  foodMonth: {type: Number, default: 32},
  fuelMonth: {type: Number, default: 0},
  alcoholMonth: {type: Number, default: 20},
  medicinesMonth: {type: Number, default: 0},
  billsMonth: {type: Number, default: 0},
  clothesMonth: {type: Number, default: 50},
  entertainmentMonth: {type: Number, default: 0},
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
  const { counter, day, month, money } = data;
  
  const dateFromDB = new Date(`${month}/${day}/2021`);
 
  const difference = actualDate.getTime() - dateFromDB.getTime();
  const differenceDays = (Math.ceil(difference / (1000 * 3600 * 24))) - 1;
  
  //jeśli jest ten sam dzień, zwróć zaktualizowane dane
  if(counter === differenceDays) return res.json(data);
  
  //jeśli jest nowy miesiąc rozliczeniowy, aktualizuj
  if(differenceDays > 27 && actualDay >= 25){
    await dayModel.findOneAndUpdate(
      {
        id: 'expences'
      },{
        money: 2850,
        month: actualMonth,
        counter: 1,
        moneyConstant: 2850,
        counter: differenceDays,
        food: 0,
        fuel: 0,
        alcohol: 0,
        medicines: 0,
        bills: 0,
        clothes: 0,
        entertainment: 0,
        foodMonth: 0,
        fuelMonth: 0,
        alcoholMonth: 0,
        medicinesMonth: 0,
        billsMonth: 0,
        clothesMonth: 0,
        entertainmentMonth: 0
      })
  }else {
    //jeśli jest nowy dzień, zaktualizuj dane
    await dayModel.findOneAndUpdate(
      {
        id: 'expences'
      },{
        moneyConstant: money,
        counter: differenceDays,
        food: 0,
        fuel: 0,
        alcohol: 0,
        medicines: 0,
        bills: 0,
        clothes: 0,
        entertainment: 0,
      });
    const data = await dayModel.findOne({id: 'expences'})
    res.json(data);
  };
});

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
  res.json(data);
})

// new dayModel({
// }).save();

const serverPort = process.env.PORT || 8080;
app.listen(serverPort);