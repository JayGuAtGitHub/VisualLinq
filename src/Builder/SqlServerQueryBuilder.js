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
