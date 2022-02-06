
class Probe{

    name
    title
    desc
    lastReading = 'Never'
    reading = 0

    constructor(name){
       this.name = name ;

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' ; break }
           case 'ph'  : { this.title = 'pH'          ; this.desc='Acidity'                ; break }
           case 'tds' : { this.title = 'TDS'         ; this.desc='Total Dissolved Solids' ; break }
           case 'temp': { this.title = 'Temperature' ; this.desc='Temperature'            ; break }
       }
    }

    formatReading() {
        switch (this.name){
            case 'orp' : { return lastReading }
            case 'ph'  : { return lastReading }
            case 'tds' : { return lastReading }
            case 'temp': { return lastReading }
        }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}