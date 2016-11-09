/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../RuntimeTypes/RuntimeType.ts" />
module Linq.Expressions{
    export class MethodCallExpression implements IExpression{
        private _nodeType:ExpressionType;
         get NodeType() : ExpressionType {
             return ExpressionType.Lambda; 
        }
        ReturnType:RuntimeTypes.RuntimeType;
        Method:string;
        Caller:any;
        Arguments:IExpression[];
    }
}