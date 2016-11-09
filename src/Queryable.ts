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


module Linq{
    export class Queryable<T> extends BaseQueryable implements IQueryable<T> {

        static CreateWithDescription<T>(value : RuntimeTypes.RuntimeType,genericType:T) : Queryable<T>{
            var result = new Queryable();
            result.ObjectQuery
            result.Type = value;
            return result;
        }
        Where<T>(predicate: (element) => boolean):IQueryable<T>{
            return this.WhereUsingLambda(new Linq.Expressions.JsLambdaExpression(predicate.toString()));
        }
        WhereUsingLambda<T>(predicate: Linq.Expressions.JsLambdaExpression):IQueryable<T>{
            return this._where(this.ObjectQuery,predicate);
        }
        private _where<T>(_this:Linq.Expressions.IExpression,predicate:Linq.Expressions.JsLambdaExpression):IQueryable<T>{
            var result = new Queryable();
            var methodCall = new Linq.Expressions.MethodCallExpression();
            methodCall.Arguments = [this.ObjectQuery,predicate];
            methodCall.Method = "Where";
            methodCall.ReturnType = this.Type;
            result.ObjectQuery = methodCall;
            return result;
        }
        Select<T,TResult>(selector: (element: T) => TResult):IQueryable<TResult>{
            return this.SelectUsingLambda(new Linq.Expressions.JsLambdaExpression(selector.toString()));
        }
        SelectUsingLambda<T,TResult>(selector: Linq.Expressions.JsLambdaExpression):IQueryable<TResult>{
            return this._select(this.ObjectQuery,selector);
        }
        private _select<T,TResult>(methodExp:Linq.Expressions.IExpression
        ,selector:Linq.Expressions.JsLambdaExpression):IQueryable<TResult>{
            var result = new Queryable();
            var methodCall = new Linq.Expressions.MethodCallExpression();
            methodCall.Arguments = [methodExp,selector];
            methodCall.Method = "Select";
            methodCall.ReturnType = this._parseSelect(selector);
            result.ObjectQuery = methodCall;
            return result;
        }
        private _parseSelect(selector:Linq.Expressions.JsLambdaExpression) : RuntimeTypes.RuntimeType
        {
            var result = new RuntimeTypes.RuntimeType();
            result.Fields = esprima.parse(selector.Body).body[0]
            .expression.body.body[0].argument.properties.map(element => {
                //support t => {return {a:t.a}}
                //not support t => {return {a:1}}
                var valueType = element.value.type;
                if(valueType==='MemberExpression'){
                    var field = this.Type.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                if(valueType==='CallExpression'){
                    if(element.value.callee.property.name === 'Count'){
                        return {Name:element.key.name,NativeType:RuntimeTypes.NativeType.number};
                    }
                
                    if(element.value.callee.property.name === 'CountDistinct'){
                        return {Name:element.key.name,NativeType:RuntimeTypes.NativeType.number};
                    }
                    
                }
                throw Linq.Exceptions.ConstSystemExceptions.MethodNotSupportInLambdaExpression;
                
            });
            return result;
        }
        GroupBy<TKey,TSource>(groupAt: (element: TSource) => TKey):IGrouping<TKey,TSource>{
            return this.GroupByUsingLambda<TKey,TSource>(new Linq.Expressions.JsLambdaExpression(groupAt.toString()));
        }
        GroupByUsingLambda<TKey,TSource>(groupAt: Linq.Expressions.JsLambdaExpression):IGrouping<TKey,TSource>{
            return this._groupBy<TKey,TSource>(this.ObjectQuery,groupAt);
        }
        private _groupBy<TKey,TSource>(methodExp:Linq.Expressions.IExpression,groupAt:Linq.Expressions.JsLambdaExpression)
        :IGrouping<TKey,TSource>{
            var result = new Grouping<TKey,TSource>();
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [methodExp,groupAt];
            result.ObjectQuery.Method = "GroupBy";
            result.ObjectQuery.ReturnType = methodExp.ReturnType;
            result.KeyType = new RuntimeTypes.RuntimeType();
            result.KeyType.Fields = esprima.parse(groupAt.Body).body[0]
            .expression.body.body[0].argument.properties.map(element => {
                //support t => {return {a:t.a}}
                //not support t => {return {a:1}}
                var valueType = element.value.type;
                if(valueType==='MemberExpression'){
                    var field = this.Type.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                throw Linq.Exceptions.ConstSystemExceptions.MethodNotSupportInLambdaExpression;
                
            });
            return result;
        }

        Join<T,TJoined,TResult>(joined : Queryable<T>
        ,predicate : (source:T,joined :TJoined) => boolean
        ,resultSelector : (source:T,joined :TJoined) => TResult) : IQueryable<TResult>{
            return this.JoinUsingLambda(joined
            ,new Linq.Expressions.JsLambdaExpression(predicate.toString())
            ,new Linq.Expressions.JsLambdaExpression(resultSelector.toString()))
        }
        JoinUsingLambda<T,TJoined,TResult>(joined : Queryable<T>
        ,predicate: Linq.Expressions.JsLambdaExpression
        ,resultSelector : Linq.Expressions.JsLambdaExpression): IQueryable<TResult>{
            return this._join<T,TJoined,TResult>(this.ObjectQuery,
            new Linq.Expressions.ConstantExpression(joined,joined.Type)
            ,predicate,resultSelector);
        }
        _join<TSource,TJoined,TResult>(methodExp:Linq.Expressions.MethodCallExpression
        ,joined : Linq.Expressions.ConstantExpression
        ,predicate: Linq.Expressions.JsLambdaExpression
        ,resultSelector : Linq.Expressions.JsLambdaExpression
        ):IQueryable<TResult>{
            var result = new Queryable<TResult>();
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [methodExp,joined,predicate,resultSelector];
            result.ObjectQuery.Method = "Join";
            result.ObjectQuery.ReturnType = this._parseJoin(methodExp,
            joined,
            predicate,
            resultSelector);
            return result;
        }
        private _parseJoin(methodExp:Linq.Expressions.MethodCallExpression
        ,joined : Linq.Expressions.ConstantExpression
        ,predicate: Linq.Expressions.JsLambdaExpression
        ,resultSelector : Linq.Expressions.JsLambdaExpression):RuntimeTypes.RuntimeType{
            let result = new RuntimeTypes.RuntimeType();
            let resultSelectExp = esprima.parse(resultSelector.Body).body[0].expression;
            let sourceIdentify = resultSelectExp.params[0].name;
            let joinedIdentify = resultSelectExp.params[1].name;
            
            result.Fields = resultSelectExp.body.body[0].argument.properties.map(element => {
                let key = element.value.object.name;
                if(key === sourceIdentify){
                    let field = this.Type.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                if(key === joinedIdentify){
                    let field = joined.Type.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                throw "key not map to sourceIdentify or joinedIdentify"
            });

            return result;
        }
        ToList<T>():BaseQueryable[]{
            let t = new Linq.Builder.SqlServerQueryBuilder<T>(this);
            return t.expressionList;
        }

        
    }

    export class Grouping<TKey,TSource> extends Queryable<TSource> implements IGrouping<TKey,TSource>
    {
        ObjectQuery:Linq.Expressions.MethodCallExpression;
        Type : RuntimeTypes.RuntimeType;
        KeyType:RuntimeTypes.RuntimeType;
        Key:TKey;
    }


}