/// <reference path="Ast/IExpression.ts" />
module Linq{
    export interface IQueryable<T>{
        Type : RuntimeTypes.RuntimeType;
        Where<TSource>(predicate: (element: T) => boolean):IQueryable<TSource>
        GroupBy<TSource,TKey>(keySelector:(element: T) => TKey):IGrouping<TKey,TSource>
        Select<TSource,TResult>(selector:(element: TSource) => TResult):IQueryable<TResult>
    }
}