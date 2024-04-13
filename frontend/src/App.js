import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Dashboard from "./pages/Dashboard.jsx";
import Submit from "./pages/Submit.jsx";
import Navbar from "./components/Navbar.jsx";
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <ToastContainer />

                <Routes>
                    <Route>exact path = "" </Route>
                    <Route exact path="/" element={<Dashboard></Dashboard>}></Route>
                    <Route exact path="/submit" element={<Submit></Submit>}></Route>
                    <Route exact path="/submit" element={<Submit></Submit>}></Route>

                </Routes>
            </Router>
        </div>
    );
}

export default App;
