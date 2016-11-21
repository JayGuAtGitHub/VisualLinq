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
        static CreateGroupingType(groupType:RuntimeTypes.RuntimeType,genericType : RuntimeTypes.RuntimeType): RuntimeTypes.RuntimeType{
            let type = new RuntimeTypes.RuntimeType();
            type.IsGeneric = true;
            type.GenericWrapperTypeName = "Grouping";
            type.GenericItemsTypes = [groupType,genericType];
            return type;
        }
        
        static CreateQueryableType(value : RuntimeTypes.RuntimeType): RuntimeTypes.RuntimeType{
            let type = new RuntimeTypes.RuntimeType();
            type.IsGeneric = true;
            type.GenericWrapperTypeName = "Queryable";
            type.GenericItemsTypes = [value];
            return type;
        }
        static CreateWithDescription<T>(provider:Linq.Providers.IQueryProvider,value : RuntimeTypes.RuntimeType,genericType:T) : Queryable<T>{
            var result = new Queryable<T>(provider);
            result.Type = Linq.Queryable.CreateQueryableType(value);
            return result;
        }
        Where<T>(predicate: (element) => boolean):IQueryable<T>{
            return this.WhereUsingLambda(new Linq.Expressions.JsLambdaExpression(predicate.toString()));
        }
        WhereUsingLambda<T>(predicate: Linq.Expressions.JsLambdaExpression):IQueryable<T>{
            return this._where(this,predicate);
        }
        private _where<T>(_this:BaseQueryable,predicate:Linq.Expressions.JsLambdaExpression):IQueryable<T>{
            var result = new Queryable(this.Provider);
            var methodCall = new Linq.Expressions.MethodCallExpression();
            methodCall.Arguments = [_this,predicate];
            methodCall.Method = "Where";
            methodCall.ReturnType = _this.Type;
            result.ObjectQuery = methodCall;
            result.Type = result.ObjectQuery.ReturnType;
            return result;
        }
        Select<T,TResult>(selector: (element: T) => TResult):IQueryable<TResult>{
            return this.SelectUsingLambda(new Linq.Expressions.JsLambdaExpression(selector.toString()));
        }
        SelectUsingLambda<T,TResult>(selector: Linq.Expressions.JsLambdaExpression):IQueryable<TResult>{
            return this._select(this,selector);
        }
        private _select<T,TResult>(_this:BaseQueryable
        ,selector:Linq.Expressions.JsLambdaExpression):IQueryable<TResult>{
            var result = new Queryable(this.Provider);
            var methodCall = new Linq.Expressions.MethodCallExpression();
            methodCall.Arguments = [_this,selector];
            methodCall.Method = "Select";
            methodCall.ReturnType = Linq.Queryable.CreateQueryableType(this._parseSelect(selector));
            result.ObjectQuery = methodCall;
            result.Type = result.ObjectQuery.ReturnType;
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
                    if(this.Type.Name == "Queryable"){
                        var field = this.ElementType.GetField(element.value.property.name);
                    }
                    if(this.Type.Name == "Grouping"){
                        for(var i of this.Type.GenericItemsTypes){
                            var field = i.GetField(element.value.property.name);
                            if(i != null){
                                break;
                            }
                        }
                    }
                    var field = this.ElementType.GetField(element.value.property.name);
                    if(field == null){
                        field = this.Type.GetField(element.value.property.name);
                    }
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                if(valueType==='CallExpression'){
                    var calleeName = element.value.callee.property.name;
                    if(calleeName === 'Count' ||
                    calleeName === 'Max' ||
                    calleeName === 'Avg' ||
                    calleeName === 'Min' ||
                    calleeName === 'Sum' 
                    ){
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
            return this._groupBy<TKey,TSource>(this,groupAt);
        }
        private _groupBy<TKey,TSource>(t_value:BaseQueryable,groupAt:Linq.Expressions.JsLambdaExpression)
        :IGrouping<TKey,TSource>{
            var result = new Grouping<TKey,TSource>(this.Provider);
            result.ObjectQuery = new Linq.Expressions.MethodCallExpression();
            result.ObjectQuery.Arguments = [t_value,groupAt];
            result.ObjectQuery.Method = "GroupBy";
            let keyType = new RuntimeTypes.RuntimeType();
            keyType.Fields = esprima.parse(groupAt.Body).body[0]
            .expression.body.body[0].argument.properties.map(element => {
                //support t => {return {a:t.a}}
                //not support t => {return {a:1}}
                var valueType = element.value.type;
                if(valueType==='MemberExpression'){
                    var field = this.ElementType.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                throw Linq.Exceptions.ConstSystemExceptions.MethodNotSupportInLambdaExpression;
                
            });
            result.ObjectQuery.ReturnType = 
            Linq.Queryable.CreateGroupingType(keyType,t_value.Type);
            result.Type = result.ObjectQuery.ReturnType;
            return result;
        }

        Join<T,TJoined,TResult>(joined : Queryable<TJoined>
        ,predicate : (source:T,joined :TJoined) => boolean
        ,resultSelector : (source:T,joined :TJoined) => TResult) : IQueryable<TResult>{
            return this.JoinUsingLambda(joined
            ,new Linq.Expressions.JsLambdaExpression(predicate.toString())
            ,new Linq.Expressions.JsLambdaExpression(resultSelector.toString()))
        }
        JoinUsingLambda<T,TJoined,TResult>(joined : Queryable<TJoined>
        ,predicate: Linq.Expressions.JsLambdaExpression
        ,resultSelector : Linq.Expressions.JsLambdaExpression): IQueryable<TResult>{
            return this._join<T,TJoined,TResult>(this,
            joined
            ,predicate,resultSelector);
        }
        _join<TSource,TJoined,TResult>(t_value:BaseQueryable
        ,joined : BaseQueryable
        ,predicate: Linq.Expressions.JsLambdaExpression
        ,resultSelector : Linq.Expressions.JsLambdaExpression
        ):IQueryable<TResult>{
            var result = new Queryable<TResult>(this.Provider);
            var m_call_exp = new Linq.Expressions.MethodCallExpression();
            m_call_exp.Arguments = [t_value,joined,predicate,resultSelector];
            m_call_exp.Method = "Join";
            m_call_exp.ReturnType = Linq.Queryable.CreateQueryableType(
                this._parseJoin(t_value,joined,predicate,resultSelector)
                );
            result.ObjectQuery = m_call_exp;
            result.Type = result.ObjectQuery.ReturnType;
            return result;
        }
        private _parseJoin(t_value:BaseQueryable
        ,joined : BaseQueryable
        ,predicate: Linq.Expressions.JsLambdaExpression
        ,resultSelector : Linq.Expressions.JsLambdaExpression):RuntimeTypes.RuntimeType{
            let result = new RuntimeTypes.RuntimeType();
            let resultSelectExp = esprima.parse(resultSelector.Body).body[0].expression;
            let sourceIdentify = resultSelectExp.params[0].name;
            let joinedIdentify = resultSelectExp.params[1].name;
            
            result.Fields = resultSelectExp.body.body[0].argument.properties.map(element => {
                let key = element.value.object.name;
                if(key === sourceIdentify){
                    let field = t_value.ElementType.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                if(key === joinedIdentify){
                    let field = joined.ElementType.GetField(element.value.property.name);
                    if(field == null){
                        throw Linq.Exceptions.ConstSystemExceptions.KeyNotFoundInEntity;
                    }
                    return {Name:element.key.name,NativeType:field.NativeType};
                }
                throw "key not map to sourceIdentify or joinedIdentify"
            });

            return result;
        }
        ToListWithCallBack<T>(callBack:(data:T[]) => any){
            this.Provider.ToListWithCallBack(this,callBack);
        }        
    }

    export class Grouping<TKey,TSource> extends Queryable<TSource> implements IGrouping<TKey,TSource>
    {
        Key:TKey;
    }


}