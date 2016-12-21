var RuntimeTypes;
(function (RuntimeTypes) {
    (function (NativeType) {
        NativeType[NativeType["number"] = 0] = "number";
        NativeType[NativeType["string"] = 1] = "string";
        NativeType[NativeType["boolean"] = 2] = "boolean";
    })(RuntimeTypes.NativeType || (RuntimeTypes.NativeType = {}));
    var NativeType = RuntimeTypes.NativeType;
})(RuntimeTypes || (RuntimeTypes = {}));
