import "./App.css";
import Home from "./pages/home";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/Login";
import Details from "./components/product-details/details";
import User from "./pages/user";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="abdukarimkaumij-jpg.github.io/youmeal/" element={<Home />} />
        <Route path="/youmeal/register" element={<Register/>} />
        <Route path="/youmeal/login" element={<Login/>} />
        <Route path="/youmeal/user" element={<User/>} />
      </Routes>
      <Footer />
      <Details />
    </>

  );
}

export default App;
