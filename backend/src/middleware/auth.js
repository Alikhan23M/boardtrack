// auth middle ware
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        
        const token = req.header("Authorization").replace("Bearer ", "");
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate." });
    }
};