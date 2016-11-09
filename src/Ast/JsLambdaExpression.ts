/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
module Linq.Expressions{
    export class JsLambdaExpression implements IExpression{
        constructor(_body:string )
        {
            this.Body = _body;
        }
        private _nodeType:ExpressionType;
        get NodeType() : ExpressionType {
             return ExpressionType.Lambda; 
        }
        Body : string ;

    }
}