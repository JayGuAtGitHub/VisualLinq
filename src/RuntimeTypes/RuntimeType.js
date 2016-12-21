/// <reference path="../Enumerables/Enumerable.ts" />
var RuntimeTypes;
(function (RuntimeTypes) {
    var RuntimeType = (function () {
        function RuntimeType() {
        }
        RuntimeType.prototype.GetField = function (fieldName) {
            return Enumerables.Enumerable.TryFirstOrDefault(this.Fields, function (t) { return t.Name === fieldName; }, null);
        };
        RuntimeType.prototype.Clone = function () {
            var result = new RuntimeType();
            if (this.Fields != null && this.Fields != undefined && this.Fields.length > 0) {
                result.Fields = this.Fields.map(function (e) { return e.Clone(); });
            }
            result.Name = this.Name;
            result.IsGeneric = this.IsGeneric;
            result.GenericWrapperTypeName = this.GenericWrapperTypeName;
            if (this.GenericItemsTypes != null && this.GenericItemsTypes != undefined && this.GenericItemsTypes.length > 0) {
                result.GenericItemsTypes = this.GenericItemsTypes.map(function (e) { return e.Clone(); });
            }
            return result;
        };
        return RuntimeType;
    }());
    RuntimeTypes.RuntimeType = RuntimeType;
})(RuntimeTypes || (RuntimeTypes = {}));
