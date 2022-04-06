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

    //Limpar tudo e limpar última entrada

    clearAll(){
        this._operation=[];
    }
    clearEntry(){
        this._operation.pop()
    }

    //Processamento de operadores/números

    pushOperation(value){
        this._operation.push(value);
        if (this._operation.length>3){
            this.calc();
        }
    }
    calc(){
        let last = this._operation.pop();
        let res = eval(this._operation.join(""));
        this._operation=[res, last];

        this.setLastNumberToDisplay();
    }
    isOperator(value){

        return (['+','=','-','%','/'].indexOf(value) > -1);
        //indexOf faz uma verificação do array, identifica o operador e retorna o index relacionado

    }
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
    setLastOperation(value){
        this._operation[this._operation.length-1]=value;
    }
    addOperation(value){

        if(isNaN(this.getLastOperation())){

            //Strings 
            if(this.isOperator(value)){
                //Trocar o operador
                this.setLastOperation(value);
            }else if(isNaN(value)){
                console.log("?")
            }else{

                this.pushOperation(value);
                this.setLastNumberToDisplay();
                
            }
        }
        else{

            //Numbers

            if(this.isOperator(value)){
                this.pushOperation(value);
            }
            else{

                let newValue = this.getLastOperation().toString()+value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay(); //Update no display
            }

        }
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
                this.addOperation('+');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
     
                break;
            case 'ponto':
                this.addOperation('.');
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

    //Processamento do Display e Botões

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn,'click drag', e =>{
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            })
            this.addEventListenerAll(btn,'mouseover mouseup mousedown', e => {
                btn.style.cursor="pointer";
            })
        });


    }

    setDisplayDateTime(){
        this.displayDate=this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime=this.currentDate.toLocaleTimeString(this._locale);
    }
    setLastNumberToDisplay(){
        let lastNumber;
        for(let i=this._operation.length-1; i>=0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber=this._operation[i];
                break;
            }
        }
        this.displayCalc=lastNumber;
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
