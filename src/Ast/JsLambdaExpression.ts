/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../../external/estree/estree.d.ts" />
module Linq.Expressions{
    export class JsLambdaExpression implements IExpression{
        constructor(_body:string )
        {
            this._body = _body;
        }
        private _nodeType:ExpressionType;
        get NodeType() : ExpressionType {
             return ExpressionType.Lambda; 
        }
        get Body():string{
            return this._body
        }
        private _body : string ;
        private _aArrowFunctionExpression:ESTree.ArrowFunctionExpression;
        get ArrowFunctionExpression():ESTree.ArrowFunctionExpression
        {
            this._aArrowFunctionExpression = this._aArrowFunctionExpression || 
            (esprima.parse(this.Body).body[0] as ESTree.ExpressionStatement).expression as ESTree.ArrowFunctionExpression;
            return this._aArrowFunctionExpression;
        }
        GetLambdaIdentityMap(types: string[]): { [key: string]: string; }{          
            let lambdaIdentityMap: { [key: string]: string; } = {};
            this.ArrowFunctionExpression.params.map((t,i) => {
                lambdaIdentityMap[(t as ESTree.Identifier).name] = types[i];
            });
            return lambdaIdentityMap;
        }

    }
}