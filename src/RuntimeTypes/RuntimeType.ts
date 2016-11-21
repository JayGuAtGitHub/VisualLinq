/// <reference path="../Enumerables/Enumerable.ts" />
module RuntimeTypes{
    export class RuntimeType{
        Fields : FieldInfo[];
        GetField(fieldName:string) : FieldInfo{
            return Enumerables.Enumerable.TryFirstOrDefault<FieldInfo>(this.Fields,t => t.Name === fieldName,null)
        }
        Name:string;
        IsGeneric:boolean;
        GenericWrapperTypeName:string;
        GenericItemsTypes:RuntimeType[];
        Clone():RuntimeType{
            var result = new RuntimeType();
            if(this.Fields != null && this.Fields != undefined && this.Fields.length >0){
                result.Fields = this.Fields.map(e => e.Clone());
            }
            result.Name = this.Name;
            result.IsGeneric = this.IsGeneric;
            result.GenericWrapperTypeName = this.GenericWrapperTypeName;
            if(this.GenericItemsTypes != null && this.GenericItemsTypes != undefined && this.GenericItemsTypes.length >0){
                result.GenericItemsTypes = this.GenericItemsTypes.map(e => e.Clone());
            }
            return result;
        }
    }
}