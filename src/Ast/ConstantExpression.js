/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../RuntimeTypes/RuntimeType.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var ConstantExpression = (function () {
            function ConstantExpression(_body, _type) {
                this.Body = _body;
                this.Type = _type;
            }
            Object.defineProperty(ConstantExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Constant;
                },
                enumerable: true,
                configurable: true
            });
            return ConstantExpression;
        }());
        Expressions.ConstantExpression = ConstantExpression;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
