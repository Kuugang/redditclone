import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MyContext } from "./utils/Context.jsx";
import { useContext, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Cookies from "js-cookie";
import Dashboard from "./pages/Dashboard.jsx";
import Submit from "./pages/Submit.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx"
import Community from "./pages/Community.jsx";

function App() {
    const { setIsLoggedIn, setUserData } = useContext(MyContext);
    useEffect(() => {
        const validateUser = async () => {
            let cookie = Cookies.get("PHPSESSID");
            if (cookie) {
                let response = await fetch(
                    "http://localhost:6969/users/validate",
                    {
                        credentials: "include",
                    }
                );
                if (response.status == 200) {
                    let responseJSON = await response.json();
                    setIsLoggedIn(true);
                    setUserData(responseJSON.data.user);
                }

            }
        }

        validateUser();
    }, [])

    return (
        <div className="App pt-[66px] bg-[rgb(11,20,22)]">
            <Router>
                <Navbar />
                <ToastContainer />

                <Routes>
                    <Route>exact path = "" </Route>
                    <Route exact path="/" element={<Dashboard />}></Route>

                    <Route exact path="/submit" element={<Submit></Submit>}></Route>
                    {/* <Route exact path="/submit" element={<Submit></Submit>}></Route> */}
                    <Route exact path="/admin" element={<AdminDashboard />}></Route>
                    <Route exact path="/r/:name" element={<Community />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
