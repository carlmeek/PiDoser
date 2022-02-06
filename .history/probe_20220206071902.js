
class Probe{

    var title

    constructor(name){
       this.name = name ;

       switch (name){
           case 'orp' : title = 'ORP'
           case 'ph'  :
       }
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}