
class Probe{

    params
    name
    title
    desc
    lastReading = 'Never'
    reading = 0
    myParams

    constructor(passparams,name){
       this.name = name
       this.params = passparams

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' ; this.myParams=params.orp ; break }
           case 'ph'  : { this.title = 'pH'          ; this.desc='Acidity'                ; this.myParams=params.ph ;break }
           case 'tds' : { this.title = 'TDS'         ; this.desc='Total Dissolved Solids' ; this.myParams=params.tds ;break }
           case 'temp': { this.title = 'Temperature' ; this.desc='Temperature'            ; this.myParams=params.temp ;break }
       }
    }

    formatReading() {
        switch (this.name){
            case 'orp' : { return this.reading }
            case 'ph'  : { return this.reading }
            case 'tds' : { return this.reading }
            case 'temp': { return this.reading + "&deg;C" }
        }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}