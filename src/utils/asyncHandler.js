const asyncHandler=(fn)=>{
    return async(req,res,next)=>{
        try{
            await fn(req,res,next)
        }catch(error){
            console.log("There is error in async handler", error)
            next(error);
        }
    }
}
export default asyncHandler;