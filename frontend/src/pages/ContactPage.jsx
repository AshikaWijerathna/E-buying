import axios from "axios";
import React, { useState } from "react";
const ContactPage = () =>{
    const [form, setForm] = useState({
        name:"",
        email:"",
        message:""
    });
    const handleChange=(e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const res = await axios.post("/api/contact", form);
            alert("Message sent successfully!");
            setForm({name: "", email:"", message:""});
        }catch(error){
            console.error(err);
            alert("Failed to send message");
        }
    }
    return(
    <div className="min-h-screen bg-gray-900 text-white py-16 px-6 mt-10 mb-10 ml-10 mr-10 border-4 border-gray-400 border-dashed flex justify-center items-center">
        <div className="max-w-6xl mx-auto">
            {/*Header*/}
            <h1 className="text-5xl font-bold text-[#0096FF] text-center mb-6">
                Contact Us
            </h1>
            <p className="text-center text-gray-300 text-lg max-w-3xl mx-auto mb-14">
                Have questions, feedback, or need support?
                We're here to help! Fill out the form below and our team will respond shortly.
            </p>
            {/*Grid Section*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/*Contact Info */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
                    <p className="text-gray-400 leading-7">
                        You can reach out to us anytime using the information below.We're committed to providing fast and friendly support.
                    </p>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Email</h3>
                        <p className="text-gray-400">maldanmart@gmail.com</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Phone</h3>
                        <p className="text-gray-400">+94 0707783656</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Address</h3>
                        <p className="text-gray-400">123 BSC Street, Blue Land, USA</p>
                    </div>
                </div>
                {/*Contact Form */}
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/*Name*/}
                        <div>
                            <label className="block text-gray-300 mb-2">Name</label>
                            <input name="name" value={form.name} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#0096FF] focus:outline-none"
                            placeholder="Your name" required />
                        </div>
                        {/* Email*/ }
                        <div>
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#0096FF] focus:outline-none" placeholder="you@example.com" required/>
                        </div>
                        {/*Message*/}
                        <div>
                            <label className="block text-gray-300 mb-2">Message</label>
                            <textarea name="message" value={form.message} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2focus:ring-[#0096FF] focus:outline-none" placeholder="Write your message..." required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-[#0096FF] py-3 rounded-lg text-white font-semibold hover:bg-[#0080dc] transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
)}

export default ContactPage;