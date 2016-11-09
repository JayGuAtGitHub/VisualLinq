/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../RuntimeTypes/RuntimeType.ts" />
module Linq.Expressions{
    export class ConstantExpression implements IExpression{
        constructor(_body:Object,_type:RuntimeTypes.RuntimeType)
        {
            this.Body = _body;
            this.Type = _type;
        }
        private _nodeType:ExpressionType;
        get NodeType() : ExpressionType {
             return ExpressionType.Constant; 
        }
        Body : Object ;
        Type:RuntimeTypes.RuntimeType;

    }
}