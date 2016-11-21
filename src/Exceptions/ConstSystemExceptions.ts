module Linq.Exceptions{
    export class ConstSystemExceptions{
         static KeyNotFoundInEntity : string = "cannot find the key in the current entity";
         static MethodNotSupportInLambdaExpression : string = "the method is not support in the lambda expression";
         static InLambdaExpression_KeyInBodyNotFoundInParameter = "The key in the body of the expression does not match any key in the parameters";
         static NotSupported(text:string):string{return "this operator is not supported"+text;}
    }
}