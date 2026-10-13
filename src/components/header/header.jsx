import "./header.css";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/authMe-context";
import logo from "../../assets/logo.svg";
import pic from "../../assets/pic.png";

function Header() {
    const {
        user,
        loading,
    } = useAuthContext();


    return (
        <section className="wrapper">
            <div className="container">
                <header className="header">
                    <div className="header__content">

                        <Link to="/youmeal/" className="header__content-logo">
                            <img
                                src={logo}
                                alt="Logo"
                                className="header__logo-img"
                            />
                        </Link>

                        <div className="header__register-btn">

                            {loading ? (
                                <span>Loading...</span>

                            ) : user ? (
                                <>
                                    <NavLink to="/youmeal/user" className="header__btn">
                                        {user.name}
                                    </NavLink>

                                </>

                            ) : (
                                <>
                                    <NavLink
                                        className="header__btn"
                                        to="/youmeal/register"
                                    >
                                        Register
                                    </NavLink>

                                    <span>/</span>

                                    <NavLink
                                        className="header__btn"
                                        to="/youmeal/login"
                                    >
                                        Login
                                    </NavLink>
                                </>
                            )}

                        </div>
                    </div>
                </header>

                <div className="bg">
                    <div className="bg__content">

                        <div className="bg__content-img">
                            <img src={pic} alt="" />
                        </div>

                        <div className="bg__content-info">
                            <h1 className="bg__info-title">
                                Только самые
                                <span> сочные бургеры!</span>
                            </h1>

                            <p className="bg__info-text">
                                Бесплатная доставка от 599₽
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

export default Header;