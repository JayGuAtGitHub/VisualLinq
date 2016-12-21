module Enumerables{
    export class Enumerable<T>{
        static SOURCE_IS_EMPTY = "source is empty";
        static TryAny<T>(source:T[],predicator:(element: T) => boolean):boolean{
            if(source != null && source != undefined){
                return Enumerable.Any(source,predicator);
            }
            return false;
        }
        static Any<T>(source:T[],predicator:(element: T) => boolean):boolean{
            for(var i of source){
                if(predicator){
                    if(predicator(i)){
                        return true;
                    }
                }else{
                    return true;
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
            return Enumerable.Aggrate(source,aggrator);
        }
        static Aggrate<T>(source:T[],aggrator:(current:T,next:T) => T):T{
            let cursor = 0;
            let result;
            for(var i of source){
                if(cursor == 0){
                    result = i;
                }else{
                    result = aggrator(result,i);
                }
                cursor++
            }
            if(cursor == 0){
                throw Enumerable.SOURCE_IS_EMPTY;
            }
            return result;
        }
        static TryFirstOrDefault<T>(source:T[],predicator:(element: T) => boolean,defaultValue:T):T{
            if(source != null && source != undefined){
                return Enumerable.FirstOrDefault(source,predicator,defaultValue);
            }
            return defaultValue;
        }
        static FirstOrDefault<T>(source:T[],predicator:(element: T) => boolean,defaultValue:T):T{
            for(var i of source){
                if(predicator){
                    if(predicator(i)){
                        return i;
                    }
                }else{
                    return i;
                }
            }
            return defaultValue;
        }
        static First<T>(source:T[],predicator:(element: T) => boolean):T{
            for(var i of source){
                if(predicator){
                    if(predicator(i)){
                        return i;
                    }
                }else{
                    return i;
                }
            }
            throw Enumerable.SOURCE_IS_EMPTY;
        }

        static Where<T>(source:T[],predicator:(element: T) => boolean):T[]{
            var result = [];
            for(var i of source){
                if(predicator(i)){
                    result.push(i);
                }
            }
            if(result.length){
                return result;
            }
            return null;
        }
        static Select<T,TResult>(source:T[],selector:(element: T) => TResult):TResult[]{
            var result = [];
            for(var i of source){
                result.push(selector(i));
            }
            if(result.length){
                return result;
            }
            return null;
        }

    }
}