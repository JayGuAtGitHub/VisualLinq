/// <reference path="RuntimeTypes/IRuntimeType.ts" />
module Linq{
    export interface IGrouping<TKey,TSource> extends RuntimeTypes.IRuntimeType
    {
        Type : RuntimeTypes.RuntimeType;
        Key:TKey;
    }
}