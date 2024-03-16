import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Dashboard from "./pages/Dashboard.tsx";
import Submit from "./pages/Submit.tsx";
import Navbar from "./components/Navbar.tsx";
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <ToastContainer />

                <Routes>
                    <Route absolute path="/" element={<Dashboard></Dashboard>}></Route>
                    <Route absolute path="/submit" element={<Submit></Submit>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
