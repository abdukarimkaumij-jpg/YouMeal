import { useRegisterContext } from "../../context/register-context";
import "./register-content.css";

function RegisterContent() {
    const {
        postUser,
        email,
        password,
        errorMessage,
    } = useRegisterContext();

    return (
        <section className="register">
            <div className="register__content container">
                <h5 className="register__content-name">
                    Register
                </h5>

                <form
                    className="register__content-form"
                    onSubmit={postUser}
                >
                    <input
                        className="register__content-input"
                        type="text"
                        name="name"
                        placeholder="Ismingiz"
                    />

                    <input
                        className="register__content-input"
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        defaultValue="+998"
                        maxLength="13"
                        pattern="\+998[0-9]{9}"
                    />

                    <input
                        ref={email}
                        className="register__content-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                    />

                    <input
                        ref={password}
                        className="register__content-input"
                        type="password"
                        name="password"
                        placeholder="Parol"
                    />

                    {errorMessage && (
                        <p className="register__content-error">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        className="register__content-button"
                        type="submit"
                    >
                        Ro‘yxatdan o‘tish
                    </button>
                </form>
            </div>
        </section>
    );
}

export default RegisterContent;