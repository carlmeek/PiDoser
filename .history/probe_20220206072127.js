
class Probe{

     title

    constructor(name){
       this.name = name ;

       switch (name){
           case 'orp' : title = 'ORP'
           case 'ph'  : title = 'pH'
           case 'tds' : title = 'TDS'
           case 'temp': title = 'Temperature'
       }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}