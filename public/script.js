import { methods } from "./methods.js";

class Main{
  constructor(){
    this.m = methods;

    this.isMouseDown = false;
    this.moveingValue = 0;
    this.witchWay = 0;
    this.actualClientWidth = null;
    this.form = null;
    this.isDesktopSize = false;

    this.sizeOfDesktop = window.matchMedia('(min-width: 600px)');

    this.expencesWrapper = document.querySelector('.expences__wrapper');
    this.expencesDayWrapper = document.querySelector('.expences__day');
    this.componentAmount = document.querySelectorAll('.component__amount');
    this.componentForms = document.querySelectorAll('.component__form');
  };

  getData(){
    fetch('/getdata',{method: 'GET'})
    .then(res=>res.json())
    .then(data => {
      this.m.updateDayData(data);
      this.m.updateCurrentData(data);
    });
  };

  checkSizeOfDesktop(checkMedia){
    checkMedia.addEventListener('change', (e) => {
      this.isDesktopSize = e.matches;
    });
    if(checkMedia.matches){
      this.isDesktopSize = true;
    };
  };

  moveWrapperMobile(e){
    if(this.isDesktopSize) return
    if(!this.isMouseDown) return;       
    if(this.witchWay >= 0){
      this.moveingValue = e.touches[0].clientX - this.initialX;
    }else if(this.witchWay < 0){
      this.moveingValue = e.touches[0].clientX - this.initialX - this.actualClientWidth;
    }
    if(this.moveingValue > 0 || -this.moveingValue > this.actualClientWidth) return
    this.expencesWrapper.style.transform = `translateX(${this.moveingValue}px)`;
  };

  completeTheMove(){
    if(this.isDesktopSize) return
    if(this.moveingValue > 0 || this.moveingValue === 0) return
    if(this.witchWay < 0 && -this.moveingValue > this.actualClientWidth) return
    if(this.witchWay === 0){
      this.witchWay = -100;
    }else if(this.witchWay === -100){
      this.witchWay = 0;
    };
    this.expencesWrapper.style.transition = '0.08s';
    this.expencesWrapper.style.transform = `translateX(${this.witchWay}%)`;
    setTimeout(() => {
      this.expencesWrapper.style.transition = 'none';
      this.moveingValue = 0;
    }, 100);
  };

  movementMobile(e){
    if(this.isDesktopSize) return
    this.expencesWrapper.addEventListener('touchstart', (e) => {
      if(e.target.classList.contains('not-move')) return
      this.isMouseDown = true;
      this.initialX = e.touches[0].clientX;
      this.actualClientWidth = this.expencesWrapper.clientWidth;
    });
    window.addEventListener('touchend', (e) => {
      if(e.target.classList.contains('not-move')) return
      this.isMouseDown = false;
      this.completeTheMove();
    });
    this.expencesWrapper.addEventListener('touchmove', (e) => this.moveWrapperMobile(e));
  };

  hideForm(){
    for(const form of this.componentForms){
      form.classList.remove('visible')
      form.firstElementChild.value = ''; 
    };
  };

  addAmount(){
    this.expencesDayWrapper.addEventListener('click', (e)=> {
      e.preventDefault();
      const type = e.target.dataset.day;
      
      if(
        e.target.classList.contains('component__amount') ||
        e.target.classList.contains('component__value')
      ){
        this.hideForm();
        this.form = document.querySelector(`[data-form = "${type}"]`);
        this.form.classList.add('visible');
        this.form.firstElementChild.focus();
        this.previousValue = parseFloat(document.querySelector(`[data-dv = "${type}"]`).textContent);
        this.previousValueMonth = parseFloat(document.querySelector(`[data-month = "${type}"]`).textContent);
      };

      if(e.target.classList.contains('component__button')){
        let inputvalue = parseFloat(this.form.firstElementChild.value)

        this.form.firstElementChild.value = '';
        this.hideForm();

        if(!inputvalue) return

        this.updateDailyData(inputvalue, e);
      };
    })
  };

  updateDailyData(inputvalue, e){
    const data = {
       sum: this.previousValue + inputvalue,
       sumMonth: this.previousValueMonth + inputvalue,
       type: e.target.parentNode.dataset.form,
       typeMonth: e.target.parentNode.dataset.form + 'Month',
       moneyMinusValue: parseFloat(this.m.moneyLeftElement.textContent) - inputvalue
      };
    fetch(`/update`,
      {
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => this.m.updateCurrentData(data));
  }
};

const main = new Main();
main.checkSizeOfDesktop(window.matchMedia('(min-width: 600px'));
main.movementMobile();
main.addAmount();
main.getData();