const jwt = require("jsonwebtoken");
const User = require('../models/user.ts')
import { Request, Response } from "express";


interface CustomRequest extends Request {
    session: any;
    userId:string;
    isAdmin:any;
  }


module.exports.auth = async(req:CustomRequest, res:Response, next:any) => {
    let token = req.session.token;
    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }
    jwt.verify(token,process.env.SECRET_KEY|| 'HYURTSCT543FGTWESZ' , (err:any, decoded:any) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      req.isAdmin = decoded.roles[0];
      next();
    });
  };
  module.exports.isAdmin = async(req:CustomRequest, res:Response, next:any) => {
    const user = await User.findOne( { _id : req.userId})
    
    if (user && user.roles && user.roles.includes("admin")) {
      next(); 
    } else {
      res.status(403).send("Require Admin Role!"); 
    }
  }

 
