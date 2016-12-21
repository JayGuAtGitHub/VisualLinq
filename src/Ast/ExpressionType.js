var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        (function (ExpressionType) {
            ExpressionType[ExpressionType["Call"] = 0] = "Call";
            ExpressionType[ExpressionType["Lambda"] = 1] = "Lambda";
            ExpressionType[ExpressionType["Constant"] = 2] = "Constant";
        })(Expressions.ExpressionType || (Expressions.ExpressionType = {}));
        var ExpressionType = Expressions.ExpressionType;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
