module Linq.Builder{
    export class AliasNameGenerator{
        Names:{} = {};
        LastCallName:string
        Get(key:string = null):string{
            if(key === null){
                return this.Get(this.LastCallName);
            }
            return key+this.Names[key];
        }
        Next(key:string = null):string{
            if(key === null){
                return this.Next(this.LastCallName);
            }
            this.LastCallName = key;
            this.Names[key] =this.Names[key]?this.Names[key]+1:1;
            return this.Get(key);
        }
    }
}