import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home />} />
                <Route path="/game" element={ <Game /> } />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;