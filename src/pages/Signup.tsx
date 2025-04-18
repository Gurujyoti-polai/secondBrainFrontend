/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("inside try");
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Submitting Data:", formData);
      alert(res.data.message);
    } catch (error: any) {
      console.error("Signup Error:", error.response || error.message);
      alert(error.response?.data?.message || "Signup failed");
    }
  };
  

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
