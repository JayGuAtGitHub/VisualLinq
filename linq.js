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
/// <reference path="RuntimeTypes/IRuntimeType.ts" />
/// <reference path="RuntimeTypes/IRuntimeType.ts" />
/// <reference path="Queryable.ts" />
/// <reference path="ExpressionType.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="../../external/estree/estree.d.ts" />
var Linq;
(function (Linq) {
    var Expressions;
    (function (Expressions) {
        var JsLambdaExpression = (function () {
            function JsLambdaExpression(_body) {
                this._body = _body;
            }
            Object.defineProperty(JsLambdaExpression.prototype, "NodeType", {
                get: function () {
                    return Expressions.ExpressionType.Lambda;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JsLambdaExpression.prototype, "Body", {
                get: function () {
                    return this._body;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JsLambdaExpression.prototype, "ArrowFunctionExpression", {
                get: function () {
                    this._aArrowFunctionExpression = this._aArrowFunctionExpression ||
                        esprima.parse(this.Body).body[0].expression;
                    return this._aArrowFunctionExpression;
                },
                enumerable: true,
                configurable: true
            });
            JsLambdaExpression.prototype.GetLambdaIdentityMap = function (types) {
                var lambdaIdentityMap = {};
                this.ArrowFunctionExpression.params.map(function (t, i) {
                    lambdaIdentityMap[t.name] = types[i];
                });
                return lambdaIdentityMap;
            };
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
var Linq;
(function (Linq) {
    var Exceptions;
    (function (Exceptions) {
        var ConstSystemExceptions = (function () {
            function ConstSystemExceptions() {
            }
            ConstSystemExceptions.NotSupported = function (text) { return "this operator is not supported" + text; };
            ConstSystemExceptions.KeyNotFoundInEntity = "cannot find the key in the current entity";
            ConstSystemExceptions.MethodNotSupportInLambdaExpression = "the method is not support in the lambda expression";
            ConstSystemExceptions.InLambdaExpression_KeyInBodyNotFoundInParameter = "The key in the body of the expression does not match any key in the parameters";
            return ConstSystemExceptions;
        }());
        Exceptions.ConstSystemExceptions = ConstSystemExceptions;
    })(Exceptions = Linq.Exceptions || (Linq.Exceptions = {}));
})(Linq || (Linq = {}));
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
/// <reference path="../IQueryable.ts" />
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
/// <reference path="../BaseQueryable.ts" />
/// <reference path="../Exceptions/ConstSystemExceptions.ts" />
/// <reference path="../../external/estree/estree.d.ts" />
/// <reference path="Checks.ts" />
/// <reference path="AliasNameGenerator.ts" />
/// <reference path="../Providers/IQueryProvider.ts" />
/// <reference path="../Providers/SimpleQueryProvider.ts" />
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
            SqlServerQueryBuilder.prototype.parseLiteral = function (t_value) {
                if (t_value.value === undefined || t_value.value === null) {
                    return "NULL";
                }
                if (typeof (t_value.value) === "boolean") {
                    return t_value.value ? "1" : "0";
                }
                if (typeof (t_value.value) === "number") {
                    return t_value.value + "";
                }
                if (typeof (t_value.value) === "string") {
                    return "'" + t_value.value.replace("'", "''") + "'";
                }
                throw Linq.Exceptions.ConstSystemExceptions.NotSupported("RegExp and other types are not supported.");
            };
            SqlServerQueryBuilder.prototype.parseMemberExpression = function (memberExpression, map) {
                var table = map[(memberExpression.object.type === "MemberExpression"
                    ? memberExpression.object.object
                    : memberExpression.object).name];
                var column = memberExpression.property.name;
                if (table === undefined) {
                    debugger;
                }
                return table + "." + column;
            };
            SqlServerQueryBuilder.prototype.parseProperty = function (element, map) {
                var columnAlias = element.key.name;
                var _value = this.parsePropertyToValue(element, map);
                return columnAlias + " = " + _value;
            };
            SqlServerQueryBuilder.prototype.parsePropertyToValue = function (element, map) {
                return this.parseExpression(element.value, map);
            };
            SqlServerQueryBuilder.prototype.parseSelector = function (exp) {
                var types = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    types[_i - 1] = arguments[_i];
                }
                return Enumerables.Enumerable.TryAggrate(this._parseSelector.apply(this, [exp].concat(types)), function (c, n) { return c + "," + n; }, null);
            };
            SqlServerQueryBuilder.prototype._parseSelectorToProperties = function (exp) {
                var sExp = exp.ArrowFunctionExpression;
                return exp.ArrowFunctionExpression.body
                    .body[0]
                    .argument.properties;
            };
            SqlServerQueryBuilder.prototype._parseSelector = function (exp) {
                var _this = this;
                var types = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    types[_i - 1] = arguments[_i];
                }
                var sExp = exp.ArrowFunctionExpression;
                var lambdaIdentityMap = exp.GetLambdaIdentityMap(types);
                return this._parseSelectorToProperties(exp).map(function (element) { return _this.parseProperty(element, lambdaIdentityMap); });
            };
            SqlServerQueryBuilder.prototype.parseCallExpression = function (exp, map) {
                var funcName = exp.callee.property.name;
                //aggrate
                if (funcName === "Count"
                    || funcName === "Max"
                    || funcName === "Min"
                    || funcName === "Sum"
                    || funcName === "Avg") {
                    if (exp.arguments == null || exp.arguments.length === 0) {
                        return funcName + "(*)";
                    }
                    return funcName + "(" + exp.arguments[0].body.property.name + ")";
                }
                //like
                if (funcName === "includes") {
                    //like '%abc%' //inline style
                    var x = exp.callee.object;
                    var tableAliasIdentity = x.object.name;
                    var columnAlias = x.property.name;
                    if (exp.arguments[0].type === "Identifier") {
                        var v = eval(exp.arguments[0].name);
                        ;
                        return map[tableAliasIdentity] + "." + columnAlias + " LIKE '%" + Builder.Check.CheckString(v).replace("'", "''") + "%'";
                    }
                    if (exp.arguments[0].type === "Literal") {
                        return map[tableAliasIdentity] + "." + columnAlias + " LIKE '%" + Builder.Check.CheckString(exp.arguments[0].value).replace("'", "''") + "%'";
                    }
                }
            };
            SqlServerQueryBuilder.prototype.parseExpression = function (exp, map) {
                if (exp.type === "BinaryExpression") {
                    return this.parseBinaryExpression(exp, map);
                }
                if (exp.type === "LogicalExpression") {
                    return this.parseLogicalExpression(exp, map);
                }
                if (exp.type === "Literal") {
                    return this.parseLiteral(exp);
                }
                if (exp.type === "MemberExpression") {
                    return this.parseMemberExpression(exp, map);
                }
                if (exp.type === "UnaryExpression") {
                    return this.parseUnaryExpression(exp, map);
                }
                if (exp.type === "ConditionalExpression") {
                    return this.parseConditionalExpression(exp, map);
                }
                if (exp.type === "CallExpression") {
                    return this.parseCallExpression(exp, map);
                }
                debugger;
                //to fill more supports here
                throw Linq.Exceptions.ConstSystemExceptions.NotSupported("this type is not supported yet:" + exp.type);
            };
            SqlServerQueryBuilder.prototype.parseConditionalExpression = function (exp, map) {
                var when = this.parseExpression(exp.test, map);
                var then = this.parseExpression(exp.consequent, map);
                var _else = this.parseExpression(exp.alternate, map);
                return "CASE WHEN " + when + " THEN " + then + " ELSE " + _else + " END";
            };
            SqlServerQueryBuilder.prototype.parseUnaryExpression = function (exp, map) {
                var v = this.parseExpression(exp.argument, map);
                return "NOT (" + v + ")";
            };
            SqlServerQueryBuilder.prototype.parseBinaryExpression = function (exp, map) {
                //to be changed to a more safe way
                var operator = exp.operator;
                if ((exp.operator === "===" || exp.operator === "==")) {
                    operator = "=";
                }
                if ((exp.operator === "!==")) {
                    operator = "!=";
                }
                var right = this.parseExpression(exp.right, map), left = this.parseExpression(exp.left, map);
                if (left === "NULL" || right === "NULL") {
                    if (operator === "=") {
                        operator = "IS";
                    }
                    if (operator === "!=") {
                        operator = "IS NOT";
                    }
                }
                return left + " " + operator + " " + right;
            };
            SqlServerQueryBuilder.prototype.parseLogicalExpression = function (exp, map) {
                var operator = exp.operator === "||" ? "OR" : "AND";
                var right = this.parseExpression(exp.right, map), left = this.parseExpression(exp.left, map);
                return "(" + left + ") " + operator + " (" + right + ")";
            };
            SqlServerQueryBuilder.prototype.parsePredicator = function (exp) {
                var types = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    types[_i - 1] = arguments[_i];
                }
                return this.parseExpression(exp.ArrowFunctionExpression.body, exp.GetLambdaIdentityMap(types));
            };
            SqlServerQueryBuilder.prototype.parseJoin = function (mCallExp, fromAlias, joinAlias) {
                var t_value = mCallExp.Arguments[0];
                var joined = mCallExp.Arguments[1];
                var predicate = mCallExp.Arguments[2];
                var resultSelector = mCallExp.Arguments[3];
                var join = joined.ElementType.Name;
                var on = this.parsePredicator(predicate, fromAlias, joinAlias);
                var select = this.parseSelector(resultSelector, fromAlias, joinAlias);
                return [
                    (" SELECT " + select + " "),
                    (" JOIN " + joined.ElementType.Name + " AS " + joinAlias + " ON " + on)
                ];
            };
            SqlServerQueryBuilder.prototype.parseWhere = function (mCallExp, alias) {
                var t_value = mCallExp.Arguments[0];
                var groupAt = mCallExp.Arguments[1];
                return this.parsePredicator(groupAt, alias);
            };
            SqlServerQueryBuilder.prototype.parseGroupBy = function (mCallExp, alias) {
                var _this = this;
                var groupAt = mCallExp.Arguments[1];
                return Enumerables.Enumerable.TryAggrate(this._parseSelectorToProperties(groupAt)
                    .map(function (e) { return _this.parsePropertyToValue(e, groupAt.GetLambdaIdentityMap([alias])); }), function (c, n) { return c + ',' + n; }, null);
            };
            SqlServerQueryBuilder.prototype.parseSelect = function (mCallExp, alias) {
                var t_value = mCallExp.Arguments[0];
                var groupAt = mCallExp.Arguments[1];
                return this.parseSelector(groupAt, alias);
            };
            SqlServerQueryBuilder.CreateProvider = function (executeString) {
                return new Linq.Providers.SimpleQueryProvider(function (query, callBack) { return executeString((new SqlServerQueryBuilder(query)).BuildString(), callBack); });
            };
            SqlServerQueryBuilder.prototype.BuildString = function () {
                var str;
                str = "";
                var stack = [];
                var generator = new Builder.AliasNameGenerator();
                for (var i = this.expressionList.length - 1; i >= 0; i--) {
                    var exp = this.expressionList[i];
                    if (exp.ObjectQuery == null) {
                        str = exp.ElementType.Name + " as " + generator.Next("From");
                        stack.push("From");
                        continue;
                    }
                    switch (exp.ObjectQuery.Method) {
                        case "Where":
                            var where = this.parseWhere(exp.ObjectQuery, generator.Get());
                            str = str + " WHERE " + where;
                            stack.push(exp.ObjectQuery.Method);
                            break;
                        case "Select":
                            var select1 = this.parseSelect(exp.ObjectQuery, generator.Get());
                            str = "(SELECT " + select1 + " FROM " + str + ") as " + generator.Next("Select");
                            stack.push(exp.ObjectQuery.Method);
                            break;
                        case "GroupBy":
                            var groupAt = this.parseGroupBy(exp.ObjectQuery, generator.Get());
                            str =
                                str + " GROUP BY " + groupAt;
                            stack.push(exp.ObjectQuery.Method);
                            break;
                        case "Join":
                            var joinObj = this.parseJoin(exp.ObjectQuery, generator.Get(), generator.Next("Join"));
                            var select = joinObj[0];
                            var join = joinObj[1];
                            str = "(" + select + " FROM " + str + " " + join + ") as " + generator.Next("Join");
                            stack.push(exp.ObjectQuery.Method);
                            break;
                        default:
                            break;
                    }
                }
                return "SELECT * FROM " + str;
            };
            SqlServerQueryBuilder.prototype.GenerateExpressionList = function (query) {
                if (query != null) {
                    this.expressionList.push(query);
                    if (query.ObjectQuery != null && query.ObjectQuery.Arguments[0] != null) {
                        var _next = query.ObjectQuery.Arguments[0];
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
        Queryable.CreateGroupingType = function (groupType, genericType) {
            var type = new RuntimeTypes.RuntimeType();
            type.IsGeneric = true;
            type.GenericWrapperTypeName = "Grouping";
            type.GenericItemsTypes = [groupType, genericType];
            return type;
        };
        Queryable.CreateQueryableType = function (value) {
            var type = new RuntimeTypes.RuntimeType();
            type.IsGeneric = true;
            type.GenericWrapperTypeName = "Queryable";
            type.GenericItemsTypes = [value];
            return type;
        };
        Queryable.CreateWithDescription = function (provider, value, genericType) {
            var result = new Queryable(provider);
            result.Type = Linq.Queryable.CreateQueryableType(value);
            return result;
        };
        Queryable.prototype.Where = function (predicate) {
            return this.WhereUsingLambda(new Linq.Expressions.JsLambdaExpression(predicate.toString()));
        };
        Queryable.prototype.WhereUsingLambda = function (predicate) {
            return this._where(this, predicate);
        };
        Queryable.prototype._where = function (_this, predicate) {
            var result = new Queryable(this.Provider);
            var methodCall = new Linq.Expressions.MethodCallExpression();
            methodCall.Arguments = [_this, predicate];
            methodCall.Method = "Where";
            methodCall.ReturnType = _this.Type;
            result.ObjectQuery = methodCall;
            result.Type = result.ObjectQuery.ReturnType;
            return result;
        };
        Queryable.prototype.Select = function (selector) {
            return this.SelectUsingLambda(new Linq.Expressions.JsLambdaExpression(selector.toString()));
        };
        Queryable.prototype.SelectUsingLambda = function (selector) {
            return this._select(this, selector);
        };
        Queryable.prototype._select = function (_this, selector) {
            var result = new Queryable(this.Provider);
            var methodCall = new Linq.Expressions.MethodCallExpression();
            methodCall.Arguments = [_this, selector];
            methodCall.Method = "Select";
            methodCall.ReturnType = Linq.Queryable.CreateQueryableType(this._parseSelect(selector));
            result.ObjectQuery = methodCall;
            result.Type = result.ObjectQuery.ReturnType;
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
                    if (_this.Type.Name == "Queryable") {
                        var field = _this.ElementType.GetField(element.value.property.name);
                    }
                    if (_this.Type.Name == "Grouping") {
                        for (var _i = 0, _a = _this.Type.GenericItemsTypes; _i < _a.length; _i++) {
                            var i = _a[_i];
                            var field = i.GetField(element.value.property.name);
                            if (i != null) {
                                break;
                            }
                        }
                    }
                    var field = _this.ElementType.GetField(element.value.property.name);
                    if (field == null) {
                        field = _this.Type.GetField(element.value.property.name);
                    }
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                if (valueType === 'CallExpression') {
                    var calleeName = element.value.callee.property.name;
                    if (calleeName === 'Count' ||
                        calleeName === 'Max' ||
                        calleeName === 'Avg' ||
                        calleeName === 'Min' ||
                        calleeName === 'Sum') {
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
            return this._groupBy(this, groupAt);
        };
        Queryable.prototype._groupBy = function (t_value, groupAt) {
            var _this = this;
            var result = new Grouping(this.Provider);
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [t_value, groupAt];
            result.ObjectQuery.Method = "GroupBy";
            var keyType = new RuntimeTypes.RuntimeType();
            keyType.Fields = esprima.parse(groupAt.Body).body[0]
                .expression.body.body[0].argument.properties.map(function (element) {
                //support t => {return {a:t.a}}
                //not support t => {return {a:1}}
                var valueType = element.value.type;
                if (valueType === 'MemberExpression') {
                    var field = _this.ElementType.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                throw Linq.Exceptions.ConstSystemExceptions.MethodNotSupportInLambdaExpression;
            });
            result.ObjectQuery.ReturnType =
                Linq.Queryable.CreateGroupingType(keyType, t_value.Type);
            result.Type = result.ObjectQuery.ReturnType;
            return result;
        };
        Queryable.prototype.Join = function (joined, predicate, resultSelector) {
            return this.JoinUsingLambda(joined, new Linq.Expressions.JsLambdaExpression(predicate.toString()), new Linq.Expressions.JsLambdaExpression(resultSelector.toString()));
        };
        Queryable.prototype.JoinUsingLambda = function (joined, predicate, resultSelector) {
            return this._join(this, joined, predicate, resultSelector);
        };
        Queryable.prototype._join = function (t_value, joined, predicate, resultSelector) {
            var result = new Queryable(this.Provider);
            var m_call_exp = new Linq.Expressions.MethodCallExpression();
            m_call_exp.Arguments = [t_value, joined, predicate, resultSelector];
            m_call_exp.Method = "Join";
            m_call_exp.ReturnType = Linq.Queryable.CreateQueryableType(this._parseJoin(t_value, joined, predicate, resultSelector));
            result.ObjectQuery = m_call_exp;
            result.Type = result.ObjectQuery.ReturnType;
            return result;
        };
        Queryable.prototype._parseJoin = function (t_value, joined, predicate, resultSelector) {
            var result = new RuntimeTypes.RuntimeType();
            var resultSelectExp = esprima.parse(resultSelector.Body).body[0].expression;
            var sourceIdentify = resultSelectExp.params[0].name;
            var joinedIdentify = resultSelectExp.params[1].name;
            result.Fields = resultSelectExp.body.body[0].argument.properties.map(function (element) {
                var key = element.value.object.name;
                if (key === sourceIdentify) {
                    var field = t_value.ElementType.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                if (key === joinedIdentify) {
                    var field = joined.ElementType.GetField(element.value.property.name);
                    if (field == null) {
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return { Name: element.key.name, NativeType: field.NativeType };
                }
                throw "key not map to sourceIdentify or joinedIdentify";
            });
            return result;
        };
        Queryable.prototype.ToListWithCallBack = function (callBack) {
            this.Provider.ToListWithCallBack(this, callBack);
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
