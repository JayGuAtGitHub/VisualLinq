/// <reference path="IQueryProvider.ts" />
/// <reference path="../IQueryable.ts" />
var Linq;
(function (Linq) {
    var Providers;
    (function (Providers) {
        var SimpleQueryProvider = (function () {
            function SimpleQueryProvider(toListWithCallBackFunc) {
                this.toListWithCallBackFunc = toListWithCallBackFunc;
            }
            SimpleQueryProvider.prototype.ToListWithCallBack = function (query, callBack) {
                return this.toListWithCallBackFunc(query, callBack);
            };
            return SimpleQueryProvider;
        }());
        Providers.SimpleQueryProvider = SimpleQueryProvider;
    })(Providers = Linq.Providers || (Linq.Providers = {}));
})(Linq || (Linq = {}));
