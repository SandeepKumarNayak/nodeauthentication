
import jwt from 'jsonwebtoken';
export const identification = (req, res, next) => {
    let token;
    // console.log("Identification middleware called",req.headers);
    // Check if the request is from a browser or not
    if(req.headers.authorization){
        token = req.headers.authorization;
    } else {
        token = req.cookies.Authorization;
    }
    // console.log("Token:", token);
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized, not token provided"
        })
    }
    try {
        token = token.split(' ')[1];
        // console.log("Token:", token);
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log('Decoded tokent: ',decoded)
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Unauthorized, invalid token"
            });
        }
        req.user = decoded;
        next();
    } catch (err) {
        // console.log("Error in identification:", err);
        return res.status(401).json({
            success:false,
            message:"Unauthorized, invalid token"
        });
    }
}