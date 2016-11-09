var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        (function (ExpressionType) {
            ExpressionType[ExpressionType["Call"] = 0] = "Call";
            ExpressionType[ExpressionType["Lambda"] = 1] = "Lambda";
            ExpressionType[ExpressionType["Constant"] = 2] = "Constant";
        })(Expressions.ExpressionType || (Expressions.ExpressionType = {}));
        var ExpressionType = Expressions.ExpressionType;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
/// <reference path="ExpressionType.ts" />
/// <reference path="Ast/IExpression.ts" />
/// <reference path="Queryable.ts" />
/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var JsLambdaExpression = (function () {
            function JsLambdaExpression(_body) {
                this.Body = _body;
            }
            Object.defineProperty(JsLambdaExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Lambda;
                },
                enumerable: true,
                configurable: true
            });
            return JsLambdaExpression;
        }());
        Expressions.JsLambdaExpression = JsLambdaExpression;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
var Enumerables;
(function (Enumerables) {
    var Enumerable = (function () {
        function Enumerable() {
        }
        Enumerable.TryAny = function (source, predicator) {
            if (source != null && source != undefined) {
                for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
                    var i = source_1[_i];
                    if (predicator(i)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Enumerable.TryFirstOrDefault = function (source, predicator, defaultValue) {
            if (source != null && source != undefined) {
                for (var _i = 0, source_2 = source; _i < source_2.length; _i++) {
                    var i = source_2[_i];
                    if (predicator(i)) {
                        return i;
                    }
                }
            }
            return defaultValue;
        };
        return Enumerable;
    }());
    Enumerables.Enumerable = Enumerable;
})(Enumerables || (Enumerables = {}));
/// <reference path="../Enumerables/Enumerable.ts" />
var RuntimeTypes;
(function (RuntimeTypes) {
    var RuntimeType = (function () {
        function RuntimeType() {
        }
        RuntimeType.prototype.GetField = function (fieldName) {
            return Enumerables.Enumerable.TryFirstOrDefault(this.Fields, function (t) { return t.Name === fieldName; }, null);
        };
        return RuntimeType;
    }());
    RuntimeTypes.RuntimeType = RuntimeType;
})(RuntimeTypes || (RuntimeTypes = {}));
/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../RuntimeTypes/RuntimeType.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var MethodCallExpression = (function () {
            function MethodCallExpression() {
            }
            Object.defineProperty(MethodCallExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Lambda;
                },
                enumerable: true,
                configurable: true
            });
            return MethodCallExpression;
        }());
        Expressions.MethodCallExpression = MethodCallExpression;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../RuntimeTypes/RuntimeType.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var ConstantExpression = (function () {
            function ConstantExpression(_body, _type) {
                this.Body = _body;
                this.Type = _type;
            }
            Object.defineProperty(ConstantExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Constant;
                },
                enumerable: true,
                configurable: true
            });
            return ConstantExpression;
        }());
        Expressions.ConstantExpression = ConstantExpression;
    })(Expressions = Linq.Expressions || (Linq.Expressions = {}));
})(Linq || (Linq = {}));
var RuntimeTypes;
(function (RuntimeTypes) {
    (function (NativeType) {
        NativeType[NativeType["number"] = 0] = "number";
        NativeType[NativeType["string"] = 1] = "string";
        NativeType[NativeType["boolean"] = 2] = "boolean";
    })(RuntimeTypes.NativeType || (RuntimeTypes.NativeType = {}));
    var NativeType = RuntimeTypes.NativeType;
})(RuntimeTypes || (RuntimeTypes = {}));
/// <reference path="NativeType.ts" />
var RuntimeTypes;
(function (RuntimeTypes) {
    var FieldInfo = (function () {
        function FieldInfo() {
        }
        return FieldInfo;
    }());
    RuntimeTypes.FieldInfo = FieldInfo;
})(RuntimeTypes || (RuntimeTypes = {}));
var Linq;
(function (Linq) {
    var Exceptions;
    (function (Exceptions) {
        var ConstSystemExceptions = (function () {
            function ConstSystemExceptions() {
            }
            ConstSystemExceptions.KeyNotFoundInEntity = "cannot find the key in the current entity";
            ConstSystemExceptions.MethodNotSupportInLambdaExpression = "the method is not support in the lambda expression";
            return ConstSystemExceptions;
        }());
        Exceptions.ConstSystemExceptions = ConstSystemExceptions;
    })(Exceptions = Linq.Exceptions || (Linq.Exceptions = {}));
})(Linq || (Linq = {}));
/// <reference path="../BaseQueryable.ts" />
var Linq;
(function (Linq) {
    var Builder;
    (function (Builder) {
        var SqlServerQueryBuilder = (function () {
            function SqlServerQueryBuilder(_exp) {
                this.expressionList = [];
                this.expression = _exp;
                this.GenerateExpressionList(this.expression);
            }
            SqlServerQueryBuilder.prototype.BuildString = function (expression) {
                for (var i = this.expressionList.length - 1; i >= 0; i++) {
                    switch (expression.ObjectQuery.Method) {
                        case "Where":
                        case "Select":
                        case "GroupBy":
                        case "Join":
                            alert('Hey');
                            break;
                        default:
                            alert('Default case');
                    }
                }
                return null;
            };
            SqlServerQueryBuilder.prototype.GenerateExpressionList = function (query) {
                if (query != null && query.ObjectQuery != null) {
                    this.expressionList.push(query);
                    if (query.ObjectQuery.Arguments[0] != null) {
                        var _next = new Linq.BaseQueryable();
                        var _exp = query.ObjectQuery.Arguments[0];
                        _next.ObjectQuery = _exp;
                        _next.Type = _exp.ReturnType;
                        this.GenerateExpressionList(_next);
                    }
                }
            };
            return SqlServerQueryBuilder;
        }());
        Builder.SqlServerQueryBuilder = SqlServerQueryBuilder;
    })(Builder = Linq.Builder || (Linq.Builder = {}));
})(Linq || (Linq = {}));
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
var Linq;
(function (Linq) {
    var BaseQueryable = (function () {
        function BaseQueryable() {
        }
        Object.defineProperty(BaseQueryable.prototype, "Type", {
            get: function () {
                return this._type || this.ObjectQuery.ReturnType;
            },
            set: function (val) {
                this._type = val;
            },
            enumerable: true,
            configurable: true
        });
        return BaseQueryable;
    }());
    Linq.BaseQueryable = BaseQueryable;
})(Linq || (Linq = {}));
/// <reference path="IQueryable.ts" />
/// <reference path="BaseQueryable.ts" />
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
var Linq;
(function (Linq) {
    var Queryable = (function (_super) {
        __extends(Queryable, _super);
        function Queryable() {
            _super.apply(this, arguments);
        }
        Queryable.CreateWithDescription = function (value, genericType) {
            var result = new Queryable();
            result.Type = value;
            return result;
        };
        Queryable.prototype.Where = function (predicate) {
            return this.WhereUsingLambda(new Linq.Expressions.JsLambdaExpression(predicate.toString()));
        };
        Queryable.prototype.WhereUsingLambda = function (predicate) {
            return this._where(this.ObjectQuery, predicate);
        };
        Queryable.prototype._where = function (_this, predicate) {
            var result = new Queryable();
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [this.ObjectQuery, predicate];
            result.ObjectQuery.Method = "Where";
            result.ObjectQuery.ReturnType = this.Type;
            return result;
        };
        Queryable.prototype.Select = function (selector) {
            return this.SelectUsingLambda(new Linq.Expressions.JsLambdaExpression(selector.toString()));
        };
        Queryable.prototype.SelectUsingLambda = function (selector) {
            return this._select(this.ObjectQuery, selector);
        };
        Queryable.prototype._select = function (methodExp, selector) {
            var result = new Queryable();
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [methodExp, selector];
            result.ObjectQuery.Method = "Select";
            result.ObjectQuery.ReturnType = this._parseSelect(selector);
            return result;
        };
        Queryable.prototype._parseSelect = function (selector) {
            var _this = this;
            var result = new RuntimeTypes.RuntimeType();
            result.Fields = esprima.parse(selector.Body).body[0]
                .expression.body.body[0].argument.properties.map(function (element) {
                //support t => {return {a:t.a}}
                //not support t => {return {a:1}}
                var valueType = element.value.type;
                if (valueType === 'MemberExpression') {
                    var field = _this.Type.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                if (valueType === 'CallExpression') {
                    if (element.value.callee.property.name === 'Count') {
                        return { Name: element.key.name, NativeType: RuntimeTypes.NativeType.number };
                    }
                    if (element.value.callee.property.name === 'CountDistinct') {
                        return { Name: element.key.name, NativeType: RuntimeTypes.NativeType.number };
                    }
                }
                throw Linq.Exceptions.ConstSystemExceptions.MethodNotSupportInLambdaExpression;
            });
            return result;
        };
        Queryable.prototype.GroupBy = function (groupAt) {
            return this.GroupByUsingLambda(new Linq.Expressions.JsLambdaExpression(groupAt.toString()));
        };
        Queryable.prototype.GroupByUsingLambda = function (groupAt) {
            return this._groupBy(this.ObjectQuery, groupAt);
        };
        Queryable.prototype._groupBy = function (methodExp, groupAt) {
            var _this = this;
            var result = new Grouping();
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [methodExp, groupAt];
            result.ObjectQuery.Method = "GroupBy";
            result.ObjectQuery.ReturnType = methodExp.ReturnType;
            result.KeyType = new RuntimeTypes.RuntimeType();
            result.KeyType.Fields = esprima.parse(groupAt.Body).body[0]
                .expression.body.body[0].argument.properties.map(function (element) {
                //support t => {return {a:t.a}}
                //not support t => {return {a:1}}
                var valueType = element.value.type;
                if (valueType === 'MemberExpression') {
                    var field = _this.Type.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                throw Linq.Exceptions.ConstSystemExceptions.MethodNotSupportInLambdaExpression;
            });
            return result;
        };
        Queryable.prototype.Join = function (joined, predicate, resultSelector) {
            return this.JoinUsingLambda(joined, new Linq.Expressions.JsLambdaExpression(predicate.toString()), new Linq.Expressions.JsLambdaExpression(resultSelector.toString()));
        };
        Queryable.prototype.JoinUsingLambda = function (joined, predicate, resultSelector) {
            return this._join(this.ObjectQuery, new Linq.Expressions.ConstantExpression(joined, joined.Type), predicate, resultSelector);
        };
        Queryable.prototype._join = function (methodExp, joined, predicate, resultSelector) {
            var result = new Queryable();
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [methodExp, joined, predicate, resultSelector];
            result.ObjectQuery.Method = "Join";
            result.ObjectQuery.ReturnType = this._parseJoin(methodExp, joined, predicate, resultSelector);
            return result;
        };
        Queryable.prototype._parseJoin = function (methodExp, joined, predicate, resultSelector) {
            var _this = this;
            var result = new RuntimeTypes.RuntimeType();
            var resultSelectExp = esprima.parse(resultSelector.Body).body[0].expression;
            var sourceIdentify = resultSelectExp.params[0].name;
            var joinedIdentify = resultSelectExp.params[1].name;
            result.Fields = resultSelectExp.body.body[0].argument.properties.map(function (element) {
                var key = element.value.object.name;
                if (key === sourceIdentify) {
                    var field = _this.Type.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                if (key === joinedIdentify) {
                    var field = joined.Type.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                throw "key not map to sourceIdentify or joinedIdentify";
            });
            return result;
        };
        Queryable.prototype.ToList = function () {
            var t = new Linq.Builder.SqlServerQueryBuilder(this);
            return t.expressionList;
        };
        return Queryable;
    }(Linq.BaseQueryable));
    Linq.Queryable = Queryable;
    var Grouping = (function (_super) {
        __extends(Grouping, _super);
        function Grouping() {
            _super.apply(this, arguments);
        }
        return Grouping;
    }(Queryable));
    Linq.Grouping = Grouping;
})(Linq || (Linq = {}));
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
/// <reference path="src/Queryable.ts" />
/// <reference path="Entity/user.ts" /> 
