import './footer.css'
import logo1 from "../../assets/logo-1.svg";
import social from "../../assets/social.svg";
function Footer() {
    return (
        <>
        <footer className="footer">
            <div className="footer__content container">
                <div className="footer__content-logo">
                    <img src={logo1} alt="" />
                </div>
                <div className="footer__content-phone">
                    <h5 className="footer__name">Номер для заказа</h5>
                    <a href="tel:+79308333811" className="footer__phone-link">+7(930)833-38-11</a>
                </div>
                <div className="footer__content-social ">
                    <h5 className="footer__name">Мы в соцсетях</h5>
                    <div className="footer__social-link">
                        <a href="#" className="footer__link-img">
                            <img src={social} alt="" />
                        </a>
                        <a href="#" className="footer__link-img">
                            <img src={social} alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}
export default Footer;