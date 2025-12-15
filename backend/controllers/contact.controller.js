import Contact from "../models/contact.model.js";

export const saveContactMessage = async(req,res)=>{
    try{
        const {name, email,message} = req.body;
        const newMessage = new Contact({
            name,
            email,
            message,
        });
        await newMessage.save();
        res.status(201).json({message: "Message saved successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
}