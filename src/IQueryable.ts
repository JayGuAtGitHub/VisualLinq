/// <reference path="Ast/IExpression.ts" />
/// <reference path="RuntimeTypes/IRuntimeType.ts" />
module Linq{
    export interface IQueryable<T> extends IQueryableBase{

        Where<TSource>(predicate: (element: T) => boolean):IQueryable<TSource>

        GroupBy<TSource,TKey>(keySelector:(element: T) => TKey):IGrouping<TKey,TSource>

        Select<TSource,TResult>(selector:(element: TSource) => TResult):IQueryable<TResult>

        Join<T,TJoined,TResult>(joined : Queryable<TJoined>
        ,predicate : (source:T,joined :TJoined) => boolean
        ,resultSelector : (source:T,joined :TJoined) => TResult) : IQueryable<TResult>
    }
    export interface IQueryableBase extends RuntimeTypes.IRuntimeType{
        Type : RuntimeTypes.RuntimeType;
        Provider:Linq.Providers.IQueryProvider;
        ObjectQuery:Linq.Expressions.MethodCallExpression;
        ElementType:RuntimeTypes.RuntimeType;
    }
}