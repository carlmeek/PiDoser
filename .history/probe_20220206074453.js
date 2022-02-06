
class Probe{

    params
    name
    title
    desc
    lastReading = 'Never'
    reading = 0

    constructor(passparams,name){
       this.name = name
       this.params = passparams

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' ; break }
           case 'ph'  : { this.title = 'pH'          ; this.desc='Acidity'                ; break }
           case 'tds' : { this.title = 'TDS'         ; this.desc='Total Dissolved Solids' ; break }
           case 'temp': { this.title = 'Temperature' ; this.desc='Temperature'            ; break }
       }
    }

    settings() {
        switch (this.name){
            case 'orp' : { return this.params.settings.orp }
            case 'ph'  : { return this.params.ph }
            case 'tds' : { return this.params.tds }
            case 'temp': { return this.params.temp }
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