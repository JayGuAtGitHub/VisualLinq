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
/// <reference path="Providers/IQueryProvider.ts" />
var Linq;
(function (Linq) {
    var BaseQueryable = (function () {
        function BaseQueryable(provider) {
            this.Provider = provider;
        }
        Object.defineProperty(BaseQueryable.prototype, "Type", {
            get: function () {
                return this._type;
            },
            set: function (val) {
                this._type = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseQueryable.prototype, "ElementType", {
            get: function () {
                return this._type.GenericItemsTypes[0];
            },
            enumerable: true,
            configurable: true
        });
        return BaseQueryable;
    }());
    Linq.BaseQueryable = BaseQueryable;
})(Linq || (Linq = {}));
