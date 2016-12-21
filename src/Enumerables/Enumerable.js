var Enumerables;
(function (Enumerables) {
    var Enumerable = (function () {
        function Enumerable() {
        }
        Enumerable.TryAny = function (source, predicator) {
            if (source != null && source != undefined) {
                return Enumerable.Any(source, predicator);
            }
            return false;
        };
        Enumerable.Any = function (source, predicator) {
            for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
                var i = source_1[_i];
                if (predicator) {
                    if (predicator(i)) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        };
        Enumerable.TryAggrate = function (source, aggrator, defaultValue) {
            if (source == null) {
                return null;
            }
            if (source == undefined) {
                return undefined;
            }
            if (source.length == 0) {
                return defaultValue;
            }
            return Enumerable.Aggrate(source, aggrator);
        };
        Enumerable.Aggrate = function (source, aggrator) {
            var cursor = 0;
            var result;
            for (var _i = 0, source_2 = source; _i < source_2.length; _i++) {
                var i = source_2[_i];
                if (cursor == 0) {
                    result = i;
                }
                else {
                    result = aggrator(result, i);
                }
                cursor++;
            }
            if (cursor == 0) {
                throw Enumerable.SOURCE_IS_EMPTY;
            }
            return result;
        };
        Enumerable.TryFirstOrDefault = function (source, predicator, defaultValue) {
            if (source != null && source != undefined) {
                return Enumerable.FirstOrDefault(source, predicator, defaultValue);
            }
            return defaultValue;
        };
        Enumerable.FirstOrDefault = function (source, predicator, defaultValue) {
            for (var _i = 0, source_3 = source; _i < source_3.length; _i++) {
                var i = source_3[_i];
                if (predicator) {
                    if (predicator(i)) {
                        return i;
                    }
                }
                else {
                    return i;
                }
            }
            return defaultValue;
        };
        Enumerable.First = function (source, predicator) {
            for (var _i = 0, source_4 = source; _i < source_4.length; _i++) {
                var i = source_4[_i];
                if (predicator) {
                    if (predicator(i)) {
                        return i;
                    }
                }
                else {
                    return i;
                }
            }
            throw Enumerable.SOURCE_IS_EMPTY;
        };
        Enumerable.Where = function (source, predicator) {
            var result = [];
            for (var _i = 0, source_5 = source; _i < source_5.length; _i++) {
                var i = source_5[_i];
                if (predicator(i)) {
                    result.push(i);
                }
            }
            if (result.length) {
                return result;
            }
            return null;
        };
        Enumerable.Select = function (source, selector) {
            var result = [];
            for (var _i = 0, source_6 = source; _i < source_6.length; _i++) {
                var i = source_6[_i];
                result.push(selector(i));
            }
            if (result.length) {
                return result;
            }
            return null;
        };
        Enumerable.SOURCE_IS_EMPTY = "source is empty";
        return Enumerable;
    }());
    Enumerables.Enumerable = Enumerable;
})(Enumerables || (Enumerables = {}));
