/// <reference path="../BaseQueryable.ts" />
module Linq.Builder{
    export class SqlServerQueryBuilder<T>{
        expression:Queryable<T>;
        expressionList: BaseQueryable[];
        constructor(_exp:Queryable<T>){
            this.expressionList = [];
            this.expression = _exp;
            this.GenerateExpressionList(this.expression);
        }
        BuildString<T>(expression:Queryable<T>):T[]{
            
            for(var i = this.expressionList.length - 1;i>=0;i++){
                switch (expression.ObjectQuery.Method)
                {
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
        }

        GenerateExpressionList<T>(query:BaseQueryable){
            if(query != null && query.ObjectQuery != null){

                this.expressionList.push(query);
                if(query.ObjectQuery.Arguments[0] != null){
                    var _next = new BaseQueryable();
                    var _exp = query.ObjectQuery.Arguments[0] as Linq.Expressions.MethodCallExpression;
                    _next.ObjectQuery = _exp;
                    _next.Type = _exp.ReturnType;
                    this.GenerateExpressionList<T>(_next);
                }
            }

        }



    }
}