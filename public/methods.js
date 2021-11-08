class Methods{
  constructor(){
    this.circlesWrapper = document.querySelector('.days-left__circles');
    this.daysLeft = document.querySelector('.days-left__days');
    this.graphs = [...document.querySelectorAll('.component__graph-inside')];
    this.graphsMonth = [...document.querySelectorAll('.component__graph-inside-m')];
    this.valueDayAll = document.querySelector('.value-day-all');
    this.valueDaySum = document.querySelector('.value-day-sum');
    this.valueMonthAll = document.querySelector('.value-month-all');
    this.sumForDayElement = document.querySelector('.main-amount__number--for-day');
    this.moneyLeftElement = document.querySelector('.main-amount__number--whole');
  };

  updateDayData(data){
    const { month, counter, moneyConstant, year } = data;
    let daysInLastMonth = new Date(year, month, 0).getDate();
    let daysLeft = daysInLastMonth - counter;

    this.fillCircles(counter, daysInLastMonth);
    this.updateDaysLeft(daysLeft);
    this.sumForDay = (moneyConstant/daysLeft).toFixed(1);
    this.updateSumForDay();
  };

  updateCurrentData(data){
    const {
      money, food, fuel, alcohol, medicines, bills, clothes, entertainment,
      foodMonth, fuelMonth, alcoholMonth, medicinesMonth, billsMonth, clothesMonth, entertainmentMonth
    } = data;

    let expancesArray = [food, fuel, alcohol, medicines, bills, clothes, entertainment];
    let expancesMonthArray = [foodMonth, fuelMonth, alcoholMonth, medicinesMonth, billsMonth, clothesMonth, entertainmentMonth];
    let expancesNamesArray = ['food', 'fuel', 'alcohol', 'medicines', 'bills', 'clothes', 'entertainment'];
    let daySum = expancesArray.reduce((acc, item)=>{
      return acc + item;
    },0);

    let monthSum = expancesMonthArray.reduce((acc, item)=>{
      return acc + item;
    },0);

    this.updateExpances(expancesNamesArray, expancesArray, expancesMonthArray, daySum, monthSum);
    this.updateMoneyLeft(money);
  };

  updateMoneyLeft(money){
    this.moneyLeftElement.textContent = money;
  };

  updateSumForDay(){
    this.sumForDayElement.textContent = this.sumForDay + '0';
  };

  updateExpances(expancesNamesArray, expancesArray, expancesMonthArray, daySum, monthSum){
    expancesNamesArray.forEach((expancesName, index) =>{
       document.querySelector(`[data-dv="${expancesName}"]`).textContent = expancesArray[index];
       let percents = ((expancesArray[index] / daySum) * 100).toFixed();
       this.graphs[index].style.width = `${percents}%`;
    });
    this.valueDayAll.textContent = daySum.toFixed(2);

    expancesNamesArray.forEach((expancesName, index) =>{
      document.querySelector(`[data-month="${expancesName}"]`).textContent = expancesMonthArray[index];
      let percents = ((expancesMonthArray[index] / monthSum) * 100).toFixed();
      this.graphsMonth[index].style.width = `${percents}%`;

      this.valueMonthAll.textContent = monthSum.toFixed(2);
   });
    
    let left = (this.sumForDay - daySum).toFixed(1);
    let color = 'red';
    if(left > 0){
      left = `+${left}`;
      color = 'green'
    };
    this.valueDaySum.textContent = left + '0';
    this.valueDaySum.style.color = color;
  };

  fillCircles(counter, daysInLastMonth){
    this.circlesWrapper.innerHTML = '';
    for(let i = 0; i<daysInLastMonth; i++){
      let div = document.createElement('div');
      div.classList.add('days-left__circle');
      if(i>=counter){
        div.classList.add('days-left__circle--filled');
      };
      this.circlesWrapper.appendChild(div);
    };
  };

  updateDaysLeft(daysLeft){
    let word;
    daysLeft > 1 ? word = 'dni' : word = 'dzień';
    this.daysLeft.textContent = `${daysLeft} ${word}`;
  };
};

export const methods = new Methods();