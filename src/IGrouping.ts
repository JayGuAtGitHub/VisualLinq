module Linq{
    export interface IGrouping<TKey,TSource>
    {
        KeyType:RuntimeTypes.RuntimeType;
        Key:TKey;
    }
}