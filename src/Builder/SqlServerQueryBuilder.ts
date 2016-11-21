/// <reference path="../BaseQueryable.ts" />
/// <reference path="../Exceptions/ConstSystemExceptions.ts" />
/// <reference path="../../external/estree/estree.d.ts" />
/// <reference path="Checks.ts" />
/// <reference path="AliasNameGenerator.ts" />
/// <reference path="../Providers/IQueryProvider.ts" />
/// <reference path="../Providers/SimpleQueryProvider.ts" />
module Linq.Builder{
    export class SqlServerQueryBuilder<T>{
        expression:IQueryableBase;
        expressionList: IQueryableBase[];
        constructor(_exp:IQueryableBase){
            this.expressionList = [];
            this.expression = _exp;
            this.GenerateExpressionList(this.expression);
        }
        parseLiteral(t_value:ESTree.Literal):string{
            if(t_value.value === undefined || t_value.value === null){
                return "NULL";
            }
            if(typeof(t_value.value) === "boolean"){
                return t_value.value ? "1":"0";
            }
            if(typeof(t_value.value) === "number"){
                return t_value.value+"";
            }
            if(typeof(t_value.value) === "string"){
                return "'"+t_value.value.replace("'","''")+"'";
            }
            throw Linq.Exceptions.ConstSystemExceptions.NotSupported("RegExp and other types are not supported.");
        }
        parseMemberExpression(memberExpression:ESTree.MemberExpression,map:{ [key: string]: string;}):string{
            let table = map[((memberExpression.object.type === "MemberExpression"
            ? (memberExpression.object as ESTree.MemberExpression).object 
            : memberExpression.object) as ESTree.Identifier).name];
            let column = (memberExpression.property as ESTree.Identifier).name;
            if(table === undefined){
                debugger
            }
            return `${table}.${column}`;
        }
        parseProperty(element : ESTree.Property,map:{ [key: string]: string; }):string{
            let columnAlias = (element.key as ESTree.Identifier).name;
            let _value = this.parsePropertyToValue(element,map);
            return`${columnAlias} = ${_value}`;
        }
        parsePropertyToValue(element : ESTree.Property,map:{ [key: string]: string; }):string{
            return this.parseExpression(element.value,map);
        }
        parseSelector(exp:Linq.Expressions.JsLambdaExpression,...types: string[]):string{
            return Enumerables.Enumerable.TryAggrate(
                this._parseSelector(exp,...types)
                ,(c,n) => c+","+n,null);
        }
        _parseSelectorToProperties(exp:Linq.Expressions.JsLambdaExpression):ESTree.Property[]{
            let sExp =  exp.ArrowFunctionExpression;
            return (((exp.ArrowFunctionExpression.body as ESTree.BlockStatement)
                .body[0] as ESTree.ReturnStatement)
                .argument as ESTree.ObjectExpression).properties;
        }
        _parseSelector(exp:Linq.Expressions.JsLambdaExpression,...types: string[]):string[]{
            let sExp =  exp.ArrowFunctionExpression;
            let lambdaIdentityMap = exp.GetLambdaIdentityMap(types);
            return this._parseSelectorToProperties(exp).map(
                    element => this.parseProperty(element,lambdaIdentityMap));
        }
        
        parseCallExpression(exp : ESTree.CallExpression,map:{ [key: string]: string;}):string{
            var funcName = ((exp.callee as ESTree.MemberExpression).property as ESTree.Identifier).name;
            //aggrate
            if(funcName === "Count" 
                || funcName === "Max" 
                || funcName === "Min" 
                || funcName === "Sum" 
                || funcName === "Avg"){
                if(exp.arguments == null || exp.arguments.length === 0){
                    return `${funcName}(*)`
                }
                return `${funcName}(${(((exp.arguments[0] as ESTree.ArrowFunctionExpression).body as ESTree.MemberExpression).property as ESTree.Identifier).name})`;
            }
            //like
            if(funcName === "includes" ){
                //like '%abc%' //inline style
                var x = ((exp.callee as ESTree.MemberExpression).object as ESTree.MemberExpression);
                let tableAliasIdentity = (x.object as ESTree.Identifier).name;
                let columnAlias =  (x.property as ESTree.Identifier).name;
                if(exp.arguments[0].type === "Identifier"){
                    let v = eval((exp.arguments[0] as ESTree.Identifier).name);
                    ;
                    return `${map[tableAliasIdentity]}.${columnAlias} LIKE '%${Check.CheckString(v).replace("'","''")}%'`
                }
                if(exp.arguments[0].type === "Literal"){
                    return `${map[tableAliasIdentity]}.${columnAlias} LIKE '%${Check.CheckString((exp.arguments[0] as ESTree.Literal).value).replace("'","''")}%'`
                }
            }
        }
        
        parseExpression(exp:ESTree.Expression,map:{ [key: string]: string;}):string{
            if(exp.type === "BinaryExpression"){
                return this.parseBinaryExpression(exp as ESTree.BinaryExpression,map);
            }
            if(exp.type === "LogicalExpression"){
                return this.parseLogicalExpression(exp as ESTree.BinaryExpression,map);
            }
            if(exp.type === "Literal"){
                return this.parseLiteral(exp);
            }
            if(exp.type === "MemberExpression"){
                return this.parseMemberExpression(exp as ESTree.MemberExpression,map);
            }
            if(exp.type === "UnaryExpression"){
                return this.parseUnaryExpression(exp as ESTree.UnaryExpression,map);
            }
            if(exp.type === "ConditionalExpression"){
                return this.parseConditionalExpression(exp as ESTree.ConditionalExpression,map);
            }
            if(exp.type === "CallExpression"){
                return this.parseCallExpression(exp as ESTree.CallExpression,map);
            }
            debugger
            //to fill more supports here
            throw Linq.Exceptions.ConstSystemExceptions.NotSupported("this type is not supported yet:"+exp.type);

        }
        parseConditionalExpression(exp:ESTree.ConditionalExpression,map:{ [key: string]: string;}):string{
            let when = this.parseExpression(exp.test,map);
            let then = this.parseExpression(exp.consequent,map);
            let _else = this.parseExpression(exp.alternate,map);
            return `CASE WHEN ${when} THEN ${then} ELSE ${_else} END`
        }
        parseUnaryExpression(exp : ESTree.UnaryExpression,map:{ [key: string]: string;}):string{
            let v = this.parseExpression(exp.argument,map);
            return `NOT (${v})`
        }
        parseBinaryExpression(exp:ESTree.BinaryExpression,map:{ [key: string]: string;}):string{
            //to be changed to a more safe way
            let operator = exp.operator;
            if((exp.operator === "===" || exp.operator === "==")){
                operator = "=";
            }
            if((exp.operator === "!==")){
                operator = "!=";
            }
            let right = this.parseExpression(exp.right,map)
            ,left=this.parseExpression(exp.left,map);
            if(left=== "NULL"||right === "NULL"){
                if(operator === "="){
                    operator = "IS";
                }
                if(operator === "!="){
                    operator = "IS NOT";
                }
            }
            return `${left} ${operator} ${right}`;
        }
        parseLogicalExpression(exp:ESTree.BinaryExpression,map:{ [key: string]: string;}):string{
            let operator = exp.operator === "||" ? "OR" : "AND";
            let right = this.parseExpression(exp.right,map)
            ,left=this.parseExpression(exp.left,map);
            return `(${left}) ${operator} (${right})`;
        }
        parsePredicator(exp:Linq.Expressions.JsLambdaExpression,...types: string[]):string{
            return this.parseExpression(exp.ArrowFunctionExpression.body,exp.GetLambdaIdentityMap(types));
        }

        parseJoin(mCallExp:Linq.Expressions.MethodCallExpression,fromAlias:string,joinAlias:string):string[]{
            let t_value = mCallExp.Arguments[0] as BaseQueryable;
            let joined = mCallExp.Arguments[1] as BaseQueryable;
            let predicate = mCallExp.Arguments[2] as Linq.Expressions.JsLambdaExpression;
            let resultSelector = mCallExp.Arguments[3] as Linq.Expressions.JsLambdaExpression;
            let join = joined.ElementType.Name;
            let on = this.parsePredicator(predicate,fromAlias,joinAlias);
            let select = this.parseSelector(resultSelector,fromAlias,joinAlias);
            return [
                ` SELECT ${select} `,
                ` JOIN ${joined.ElementType.Name} AS ${joinAlias} ON ${on}`
            ];
        }
        parseWhere(mCallExp:Linq.Expressions.MethodCallExpression,alias:string):string{
            let t_value = mCallExp.Arguments[0] as BaseQueryable;
            let groupAt = mCallExp.Arguments[1] as Linq.Expressions.JsLambdaExpression;
            return this.parsePredicator(groupAt,alias);
        }
        parseGroupBy(mCallExp:Linq.Expressions.MethodCallExpression,alias:string):string{
            let groupAt = mCallExp.Arguments[1] as Linq.Expressions.JsLambdaExpression;
            return Enumerables.Enumerable.TryAggrate(
                this._parseSelectorToProperties(groupAt)
                .map(e => this.parsePropertyToValue(e,groupAt.GetLambdaIdentityMap([alias]))),
            (c,n) => c+','+n,null);
        }
        parseSelect(mCallExp:Linq.Expressions.MethodCallExpression,alias:string):string{
            let t_value = mCallExp.Arguments[0] as BaseQueryable;
            let groupAt = mCallExp.Arguments[1] as Linq.Expressions.JsLambdaExpression;
            return this.parseSelector(groupAt,alias);
        }
        static CreateProvider(executeString:(sql:string,callBack:(data:Object[]) => any)=>any) : Linq.Providers.IQueryProvider{
            return new Linq.Providers.SimpleQueryProvider(
                (query,callBack) => executeString((new SqlServerQueryBuilder(query)).BuildString(),callBack)           
            )
        }
        BuildString():string{
            let str:string;
            str = "";
            let stack = [];
            let generator = new AliasNameGenerator();
            for(var i = this.expressionList.length - 1;i>=0;i--){
                let exp = this.expressionList[i];
                if(exp.ObjectQuery == null)
                {//root of everything the from
                    str = `${exp.ElementType.Name} as ${generator.Next("From")}`;
                    stack.push("From");
                    continue;
                }
                switch (exp.ObjectQuery.Method)
                {
                case "Where":

                    let where = this.parseWhere(exp.ObjectQuery,generator.Get());
                    
                    str = `${str} WHERE ${where}`;
                     
                    stack.push(exp.ObjectQuery.Method);
                    break;
                case "Select":
                    
                    let select1 = this.parseSelect(exp.ObjectQuery,generator.Get());
                    str = `(SELECT ${select1} FROM ${str}) as ${generator.Next("Select")}`; 
                    
                    stack.push(exp.ObjectQuery.Method);
                    break;
                case "GroupBy": 

                    let groupAt = this.parseGroupBy(exp.ObjectQuery,generator.Get());

                    str =  
                    `${str} GROUP BY ${groupAt}`
                    
                    stack.push(exp.ObjectQuery.Method);
                    break;
                case "Join": 
                    let joinObj = this.parseJoin(exp.ObjectQuery,generator.Get(),generator.Next("Join"));
                    let select = joinObj[0];
                    let join = joinObj[1];
                    str = `(${select} FROM ${str} ${join}) as ${generator.Next("Join")}`
                    stack.push(exp.ObjectQuery.Method);
                    break;
                default: 
                    break;
                }
            }
            return "SELECT * FROM "+str;
        }

        GenerateExpressionList(query:IQueryableBase){
            if(query != null ){
                this.expressionList.push(query);
                if(query.ObjectQuery != null && query.ObjectQuery.Arguments[0] != null){
                    var _next = query.ObjectQuery.Arguments[0] as BaseQueryable;
                    this.GenerateExpressionList(_next);
                }
            }

        }



    }
}