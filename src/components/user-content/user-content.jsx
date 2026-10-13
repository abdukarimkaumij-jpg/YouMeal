import AuthMe from "../auth-me/auth-me";
import "./user-content.css";

function UserContent() {
    return (
        <section className="user">
            {/* Home sahifadagi "main__content" bilan bir xil layout */}
            <div className="user__content main__content container">
                <AuthMe />
            </div>
        </section>
    );
}

export default UserContent;
