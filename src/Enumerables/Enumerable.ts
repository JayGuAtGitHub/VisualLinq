module Enumerables{
    export class Enumerable<T>{
        static TryAny<T>(source:T[],predicator:(element: T) => Object):boolean{
            if(source != null && source != undefined){
                for(var i of source){
                    if(predicator(i)){
                        return true;
                    }
                }
            }
            return false;
        }
        static TryFirstOrDefault<T>(source:T[],predicator:(element: T) => boolean,defaultValue:T):T{
            if(source != null && source != undefined){
                for(var i of source){
                    if(predicator(i)){
                        return i;
                    }
                }
                
            }
            return defaultValue;
        }
    }
}