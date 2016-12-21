/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../RuntimeTypes/RuntimeType.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var MethodCallExpression = (function () {
            function MethodCallExpression() {
            }
            Object.defineProperty(MethodCallExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Lambda;
                },
                enumerable: true,
                configurable: true
            });
            return MethodCallExpression;
        }());
        Expressions.MethodCallExpression = MethodCallExpression;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
