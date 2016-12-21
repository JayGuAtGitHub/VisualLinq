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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
