
class Probe{

    title
    desc

    constructor(name){
       this.name = name ;

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' }
           case 'ph'  : { this.title = 'pH'          ; this.desc='' }
           case 'tds' : { this.title = 'TDS'          }
           case 'temp': { this.title = 'Temperature'  }
       }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}