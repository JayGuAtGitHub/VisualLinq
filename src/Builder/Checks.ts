
module Linq.Builder{
    export class Check{
        static CheckString(vari:any) : string{
            if(vari !== undefined && vari !== null && typeof(vari) === "string"){
                return vari as string;
            }
            debugger
            throw "Linq.Builder.Check.CheckString";
        }
        static CheckNotNullOrUndefined(vari:any){            
            if(vari === undefined || vari === null){
                return;
            }
            debugger
            throw "Linq.Builder.Check.CheckNotNullOrUndefined";
        }
    }
}