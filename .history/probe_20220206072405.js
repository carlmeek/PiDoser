
class Probe{

    title

    constructor(name){
       this.name = name ;

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.title='Oxygen Redux Potential' }
           case 'ph'  : { this.title = 'pH'          ; this.title='' }
           case 'tds' : { this.title = 'TDS'          }
           case 'temp': { this.title = 'Temperature'  }
       }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}