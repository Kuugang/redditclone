import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Dashboard from "./pages/Dashboard.jsx";
import Submit from "./pages/Submit.jsx";
import Navbar from "./components/Navbar.jsx";
import './App.css';
import AdminDashBoard from "./pages/AdminDashboard.jsx";

function App() {
    return (
        <div className="App pt-16">
            <Router>
                <Navbar />
                <ToastContainer />

                <Routes>
                    <Route>exact path = "" </Route>
                    <Route exact path="/" element={<Dashboard></Dashboard>}></Route>
                    <Route exact path="/submit" element={<Submit></Submit>}></Route>
                    <Route exact path="/submit" element={<Submit></Submit>}></Route>
                    <Route exact path = "/admin" element = {<AdminDashBoard></AdminDashBoard>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
