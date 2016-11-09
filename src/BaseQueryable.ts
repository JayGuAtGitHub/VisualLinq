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

module Linq{
    export class BaseQueryable{
        ObjectQuery:Linq.Expressions.IExpression;
        private _type:RuntimeTypes.RuntimeType;
        get Type() : RuntimeTypes.RuntimeType {
             return this._type || this.ObjectQuery.ReturnType; 
        }
        set Type(val : RuntimeTypes.RuntimeType){
            this._type = val;
        }
    }
}