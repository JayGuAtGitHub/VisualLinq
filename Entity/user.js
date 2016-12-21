var Entity;
(function (Entity) {
    var User = (function () {
        function User() {
        }
        Object.defineProperty(User.prototype, "Id", {
            get: function () {
                return this._Id;
            },
            set: function (val) {
                this._Id = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Age", {
            get: function () {
                return this._Age;
            },
            set: function (val) {
                this._Age = val;
            },
            enumerable: true,
            configurable: true
        });
        return User;
    }());
    Entity.User = User;
})(Entity || (Entity = {}));
