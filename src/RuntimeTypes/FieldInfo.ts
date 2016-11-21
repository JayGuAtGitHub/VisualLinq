/// <reference path="NativeType.ts" />
module RuntimeTypes{
    export class FieldInfo{
        NativeType : NativeType;
        Name:string;
        Clone():FieldInfo{
            var result = new FieldInfo();
            result.NativeType = this.NativeType;
            result.Name = this.Name;
            return result;
        }
    }
}