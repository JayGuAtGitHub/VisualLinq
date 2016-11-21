/// <reference path="IQueryable.ts" />
/// <reference path="IGrouping.ts" />
/// <reference path="Grouping.ts" />
/// <reference path="Ast/JsLambdaExpression.ts" />
/// <reference path="Ast/MethodCallExpression.ts" />
/// <reference path="Ast/ConstantExpression.ts" />
/// <reference path="RuntimeTypes/RuntimeType.ts" />
/// <reference path="RuntimeTypes/FieldInfo.ts" />
/// <reference path="Exceptions/ConstSystemExceptions.ts" />
/// <reference path="IKnownSupportedQuery.ts" />
/// <reference path="Builder/SqlServerQueryBuilder.ts" />
/// <reference path="Providers/IQueryProvider.ts" />

module Linq{
    export class BaseQueryable{
        constructor(provider:Linq.Providers.IQueryProvider){
            this.Provider = provider;
        }
        Provider:Linq.Providers.IQueryProvider;
        ObjectQuery:Linq.Expressions.MethodCallExpression;
        private _type:RuntimeTypes.RuntimeType;
        get Type() : RuntimeTypes.RuntimeType {
             return this._type; 
        }
        set Type(val : RuntimeTypes.RuntimeType){
            this._type = val;
        }
        private _elementType:RuntimeTypes.RuntimeType;
        get ElementType() : RuntimeTypes.RuntimeType {
             return this._type.GenericItemsTypes[0]; 
        }
    }
}