var Linq;
(function (Linq) {
    var Exceptions;
    (function (Exceptions) {
        var ConstSystemExceptions = (function () {
            function ConstSystemExceptions() {
            }
            ConstSystemExceptions.NotSupported = function (text) { return "this operator is not supported" + text; };
            ConstSystemExceptions.KeyNotFoundInEntity = "cannot find the key in the current entity";
            ConstSystemExceptions.MethodNotSupportInLambdaExpression = "the method is not support in the lambda expression";
            ConstSystemExceptions.InLambdaExpression_KeyInBodyNotFoundInParameter = "The key in the body of the expression does not match any key in the parameters";
            return ConstSystemExceptions;
        }());
        Exceptions.ConstSystemExceptions = ConstSystemExceptions;
    })(Exceptions = Linq.Exceptions || (Linq.Exceptions = {}));
})(Linq || (Linq = {}));
