/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../../external/estree/estree.d.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var JsLambdaExpression = (function () {
            function JsLambdaExpression(_body) {
                this._body = _body;
            }
            Object.defineProperty(JsLambdaExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Lambda;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JsLambdaExpression.prototype, "Body", {
                get: function () {
                    return this._body;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JsLambdaExpression.prototype, "ArrowFunctionExpression", {
                get: function () {
                    this._aArrowFunctionExpression = this._aArrowFunctionExpression ||
                        esprima.parse(this.Body).body[0].expression;
                    return this._aArrowFunctionExpression;
                },
                enumerable: true,
                configurable: true
            });
            JsLambdaExpression.prototype.GetLambdaIdentityMap = function (types) {
                var lambdaIdentityMap = {};
                this.ArrowFunctionExpression.params.map(function (t, i) {
                    lambdaIdentityMap[t.name] = types[i];
                });
                return lambdaIdentityMap;
            };
            return JsLambdaExpression;
        }());
        Expressions.JsLambdaExpression = JsLambdaExpression;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
