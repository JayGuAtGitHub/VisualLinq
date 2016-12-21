var Linq;
(function (Linq) {
    var Builder;
    (function (Builder) {
        var Check = (function () {
            function Check() {
            }
            Check.CheckString = function (vari) {
                if (vari !== undefined && vari !== null && typeof (vari) === "string") {
                    return vari;
                }
                debugger;
                throw "Linq.Builder.Check.CheckString";
            };
            Check.CheckNotNullOrUndefined = function (vari) {
                if (vari === undefined || vari === null) {
                    return;
                }
                debugger;
                throw "Linq.Builder.Check.CheckNotNullOrUndefined";
            };
            return Check;
        }());
        Builder.Check = Check;
    })(Builder = Linq.Builder || (Linq.Builder = {}));
})(Linq || (Linq = {}));
