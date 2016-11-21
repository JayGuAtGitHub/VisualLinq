module Enumerables{
    export class Enumerable<T>{
        static TryAny<T>(source:T[],predicator:(element: T) => boolean):boolean{
            if(source != null && source != undefined){
                for(var i of source){
                    if(predicator(i)){
                        return true;
                    }
                }
            }
            return false;
        }
        static TryAggrate<T>(source:T[],aggrator:(current:T,next:T) => T,defaultValue:T):T|null|undefined{
            if(source == null){
                return null;
            }
            if(source == undefined){
                return undefined;
            }
            if(source.length == 0){
                return defaultValue;
            }
            if(source.length == 1){
                return source[0]
            }
            var result = source[0];
            for(var i = 1;i<source.length;i++){
                result = aggrator(result,source[i]);
            }
            return result;
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