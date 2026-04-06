import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        setMessage(data.message);

        if (data.success) {
            setTimeout(() => navigate("/login"), 1500);
        }
    };

    return (
        <div
            className="animate-fade-in"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}
        >
            <div
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '3rem 2rem'
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Create Account
                </h2>

                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", marginTop: "1rem" }}
                    >
                        Register
                    </button>
                </form>

                {message && (
                    <p style={{ marginTop: "1rem", textAlign: "center" }}>
                        {message}
                    </p>
                )}

                <p style={{ textAlign: "center", marginTop: "1rem" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
