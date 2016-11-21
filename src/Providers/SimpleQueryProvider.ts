/// <reference path="IQueryProvider.ts" />
/// <reference path="../IQueryable.ts" />
module Linq.Providers{
    export class SimpleQueryProvider<T> implements IQueryProvider{
        constructor(toListWithCallBackFunc:(query:Linq.IQueryableBase,callBack:(data:T[]) => any) => any){
            this.toListWithCallBackFunc = toListWithCallBackFunc;
        }
        private toListWithCallBackFunc:(query:Linq.IQueryableBase,callBack:(data:T[]) => any) => any;
        ToListWithCallBack<T>(query:Linq.IQueryableBase,callBack:(data:Object[]) => any){
            return this.toListWithCallBackFunc(query,callBack);
        }
    }
}