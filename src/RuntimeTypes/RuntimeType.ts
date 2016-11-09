/// <reference path="../Enumerables/Enumerable.ts" />
module RuntimeTypes{
    export class RuntimeType{
        Fields : FieldInfo[];
        GetField(fieldName:string) : FieldInfo{
            return Enumerables.Enumerable.TryFirstOrDefault<FieldInfo>(this.Fields,t => t.Name === fieldName,null)
        }
        Name:string;
        IsGeneric:boolean;
        GenericWrapperType:string;
        GenericItemsTypes:string[];
    }
}