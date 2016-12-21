/// <reference path="NativeType.ts" />
var RuntimeTypes;
(function (RuntimeTypes) {
    var FieldInfo = (function () {
        function FieldInfo() {
        }
        FieldInfo.prototype.Clone = function () {
            var result = new FieldInfo();
            result.NativeType = this.NativeType;
            result.Name = this.Name;
            return result;
        };
        return FieldInfo;
    }());
    RuntimeTypes.FieldInfo = FieldInfo;
})(RuntimeTypes || (RuntimeTypes = {}));
