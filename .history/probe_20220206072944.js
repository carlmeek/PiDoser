
class Probe{

    title
    desc
    lastReading

    constructor(name){
       this.name = name ;
       this.lastReading = 'Never'

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' ; break }
           case 'ph'  : { this.title = 'pH'          ; this.desc='Acidity'                ; break }
           case 'tds' : { this.title = 'TDS'         ; this.desc='Total Dissolved Solids' ; break }
           case 'temp': { this.title = 'Temperature' ; this.desc='Temperature'            ; break }
       }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}