class CalcController{
    
    constructor(){
        
        this._locale="pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._operation = [];
        this.initialize();
        this.initButtonsEvents();

    }

    initialize(){

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
       
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation=[];
    }
    clearEntry(){
        this._operation.pop()
    }
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
    addOperation(value){
        this._operation.push(value);
        console.log(this._operation);
    }
    setError(){
        this.displayCalc = "ERROR!";
    }

    execBtn(value){
        switch(value){

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':

                break;
            case 'multiplicacao':

                break;
            case 'divisao':

                break;
            case 'subtracao':

                break;
            case 'porcento':

                break;
            case 'igual':

                break;
            case 'ponto':
                
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    };

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn,'click drag mouseover', e =>{
                console.log(btn.className.baseVal.replace("btn-",""));
            })
        })

    };

    setDisplayDateTime(){
        this.displayDate=this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime=this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML=value;
    }
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML=value;
    }
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML=value;
    }
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate=value;
    }

}
