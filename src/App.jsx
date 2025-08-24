import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CustomerAuth from "./components/CustomerAuth";
import ForgotPassword from "./components/ForgotPassword";
import AdminLoginForm from "./components/AdminLoginForm";
import AdminDashboard from "./components/AdminDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import UpdateCustomerForm from "./components/UpdateCustomerForm";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    
 
    <Routes>
      <Route path="/" element={<HomePage/>}/>     
      <Route path="/customerAuth" element={<CustomerAuth/>}/> 
      <Route path="/forgetPassword" element={<ForgotPassword/>}/>
      <Route path="/adminLogin" element={<AdminLoginForm/>}/> 
      <Route path="admindashboard" element={<AdminDashboard/>}/> 
        <Route path="/customerdashboard" element={<CustomerDashboard/>}/> 
        <Route path="/updateCustomer" element={<UpdateCustomerForm />} />
    </Routes>
    
    </BrowserRouter>
    
    
    
    
  );
}

export default App;                
