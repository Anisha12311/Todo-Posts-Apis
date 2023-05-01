
import { Request, Response } from "express";
const User = require("../models/user.ts")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


interface CustomRequest extends Request {
    session: any;
    userId: string;
  }


module.exports.UserSignup = async(req:Request,res:Response) => {
   try {
    const {name, email, password,roles} = req.body;

    if(!(name && email && password)) {
       return res.status(400).send("All inputs are required");
    }

    const exitUser = await User.findOne({email});
    if(exitUser) {
        return res.status(400).send("User already exit. Please login");
    }

    const encryptedPassword = await bcrypt.hash(password,10);
   
    const user = await User.create({
        name,
        email: email.toLowerCase(), 
        password: encryptedPassword,
        roles: roles ? roles : "user",
    })
    
    
    res.status(201).json(user);
 
   } catch (error) {
    return res.status(500).send({ message: error });
   }
    
}

module.exports.SignIn =  async(req:CustomRequest,res:Response) => {
   try {
    const {email, password} = req.body;

    if (!(email && password)) {
        return res.status(400).send("All input is required");
      }

      const user = await User.findOne({ email });
    
      if (!user) {
        return res.status(404).send("User Not found.");
      }
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send("Invalid Password!");
      }
      const payload = {
        id: user._id,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin 
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY || 'HYURTSCT543FGTWESZ', {
        expiresIn: "24h", // 24 hours
      });
      
      req.session.token = token
    
      return res.status(200).send({
        id: user.id,
        email: user.email,  
        roles:user.roles,
        token: token,
        
      });
         
   } catch (error) {
        return res.status(500).send({ message: error })
   }
    
}

module.exports.EditUserByAdmin =async(req:CustomRequest,res:Response) => {
    try {
        const { id } = req.params;
        const {name, email, password,roles} = req.body;
          const user = await User.findById(id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          if (name) {
            user.name = name;
          }
          
          if (email) {
            user.email = email;
          }
          
          if (password) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            user.password = encryptedPassword;
          }
          
          if (roles) {
            user.roles = roles;
          }
          const updatedUser = await user.save();    
          return res.status(200).json(updatedUser);
      
      } catch (err) {
        return res.status(500).json(err);
      }
}

