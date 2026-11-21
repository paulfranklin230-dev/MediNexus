import jwt from 'jsonwebtoken';
import {User} from '../models.js';
export async function protect(req,res,next){try{const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');if(!token)return res.status(401).json({message:'Authentication required'});const decoded=jwt.verify(token,process.env.JWT_SECRET);req.user=await User.findById(decoded.id);if(!req.user)return res.status(401).json({message:'Account not found'});next();}catch{return res.status(401).json({message:'Invalid or expired token'});}}
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'You do not have permission'});
