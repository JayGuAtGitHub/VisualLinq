module Entity{
    export class User{
        private _Id:string;
         get Id() : string {
             return this._Id; 
        }
        set Id(val:string){
            this._Id = val;
        }
        private _Age:number;
         get Age() : number {
             return this._Age; 
        }
        set Age(val:number){
            this._Age = val;
        }
    }
}