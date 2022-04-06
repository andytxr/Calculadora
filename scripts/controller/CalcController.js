class CalcController{
    
    constructor(){
        
        this._locale="pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._operation = [];
        this._lastOperator='';
        this._lastNumber='';
        this._audioOnOff=false;
        this._audio = new Audio('click.mp3');

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
        

    }

    //Inicialização e funcionalidades

    initialize(){

        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{

            btn.addEventListener('dblclick', e=>{
            
                this.toggleAudio();

            });
        });
    }

    toggleAudio(){

        this._audioOnOff=!this._audioOnOff;

        //O áudio está desligado, toda vez que ele for "passado" por ele, ele se torna o inverso:
        //OFF=!OFF (!=NÃO) > OFF=ON > ON=!ON > OFF=!OFF

    }
    playAudio(){

        if(this._audioOnOff){

            this._audio.play();

        }
    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{

            switch(e.key){
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
                    this.addOperation(parseInt(e.key));
                    break;

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case 'Enter':
                    this.calc();
                    break;

                case 'c':
                    if(e.ctrlKey){
                        this.copyToClipboard();
                    }
                    break;
                
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                case '=':
                    this.addOperation(e.key);
                    break;
                case '.':
                case ',':
                    this.addDot();
                
            }

        });

    }

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

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);

        });
    }

    copyToClipboard(){

        let input = document.createElement('input');
        input.value=this.displayCalc;

        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
            this.displayCalc=parseFloat(text);

        });

    }

    clearAll(){

        this._operation=[];
        this._lastNumber='';
        this._lastOperator='';

        this.setLastNumberToDisplay()

    }
    clearEntry(){

        this._operation.pop()

        this.setLastNumberToDisplay()
        
    }

    //Processamento de operadores/números/cálculo

    pushOperation(value){

        this._operation.push(value);
        if (this._operation.length>3){

            this.calc();

        }

    }
    getResult(){

        return eval(this._operation.join(""));

    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();
        
        if(this._operation.lengt<3){

            let firstItem=this._operation[0];
            this._operation=[firstItem,this._lastOperator,this._lastNumber];

        }

        else if(this._operation.length>3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }
        else if(this._operation.length==3){

            this._lastNumber=this.getLastItem(false);

        }

        // Calculando porcentagem
        let res=this.getResult();
        if (last == '%'){

            res = res/100;
            this._operation[res];

        }
        else{

            this._operation=[res];

            if(last){

                this._operation.push(last);

            }
        }

        this.setLastNumberToDisplay()
    }

    isOperator(value){

        return (['+','=','-','%','/','*'].indexOf(value) > -1);
        //indexOf faz uma verificação do array, identifica o operador e retorna o index relacionado

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value){

        this._operation[this._operation.length-1]=value;

    }

    getLastItem(isOperator=true){

        let lastItem;

            for(let i=this._operation.length-1; i>=0; i--){
   
                if(this.isOperator(this._operation[i])==isOperator){
                    lastItem=this._operation[i];
                    break;
                }
    
            }
        if(!lastItem){

            lastItem=(isOperator) ? this._lastOperator : this._lastNumber;

            //lastItem=(isOperator) < Condição
            //? < Então se a Condição for verdadeira faça X coisa
            //: < Se a Condição não for verdadeira faça X coisa

        }

        return lastItem;

    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){

            //Strings 

            if(this.isOperator(value)){

                //Trocar o operador
                this.setLastOperation(value);

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
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay(); //Update no display

            }

        }
    }
    addDot(){

        let lastOp = this.getLastOperation();

        if(typeof lastOp === 'string' && lastOp.split('').indexOf('.') > -1){

            return;

        }

        if(this.isOperator(lastOp) || !lastOp){

            this.pushOperation('0.');

        }else{

            this.setLastOperation(lastOp.toString() + '.');

        }
    }

    setError(){

        this.displayCalc = "ERROR!";

    }

    execBtn(value){

        this.playAudio();

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
                this.calc();
                break;

            case 'ponto':
                this.addDot('.');
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

    //Processamento do Display

    setDisplayDateTime(){

        this.displayDate=this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime=this.currentDate.toLocaleTimeString(this._locale);

    }

    setLastNumberToDisplay(){

        let lastNumber=this.getLastItem(false);

        if(!lastNumber){

            lastNumber=0;

        }
        if(lastNumber.toString().length>10){

            lastNumber = lastNumber.toString().substr(0, 10);

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
