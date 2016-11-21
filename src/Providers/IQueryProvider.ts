/// <reference path="../IQueryable.ts" />
module Linq.Providers{
    export interface IQueryProvider{
        ToListWithCallBack<T>(query:Linq.IQueryableBase,callBack:(data:T[]) => any);
    }
}