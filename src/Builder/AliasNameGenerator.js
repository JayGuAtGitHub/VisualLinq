var Linq;
(function (Linq) {
    var Builder;
    (function (Builder) {
        var AliasNameGenerator = (function () {
            function AliasNameGenerator() {
                this.Names = {};
            }
            AliasNameGenerator.prototype.Get = function (key) {
                if (key === void 0) { key = null; }
                if (key === null) {
                    return this.Get(this.LastCallName);
                }
                return key + this.Names[key];
            };
            AliasNameGenerator.prototype.Next = function (key) {
                if (key === void 0) { key = null; }
                if (key === null) {
                    return this.Next(this.LastCallName);
                }
                this.LastCallName = key;
                this.Names[key] = this.Names[key] ? this.Names[key] + 1 : 1;
                return this.Get(key);
            };
            return AliasNameGenerator;
        }());
        Builder.AliasNameGenerator = AliasNameGenerator;
    })(Builder = Linq.Builder || (Linq.Builder = {}));
})(Linq || (Linq = {}));
