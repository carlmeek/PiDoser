
class Probe{

    var title

    constructor(name){
       this.name = name ;
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}