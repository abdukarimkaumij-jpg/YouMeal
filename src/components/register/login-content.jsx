import { useLoginContext } from "../../context/login-context";
import "./register-content.css";

function LoginContent() {
    const {
        email,
        password,
        postLogin,
        errorMessage,
        loading,
    } = useLoginContext();

    return (
        <section className="register">
            <div className="register__content container">
                <h5 className="register__content-name">
                    Login
                </h5>

                <form
                    className="register__content-form"
                    onSubmit={postLogin}
                >
                    <input
                        className="register__content-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        ref={email}
                    />

                    <input
                        className="register__content-input"
                        type="password"
                        name="password"
                        placeholder="Parol"
                        ref={password}
                    />

                    {errorMessage && (
                        <p className="register__content-error">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        className="register__content-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Kirilmoqda..." : "Kirish"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default LoginContent;