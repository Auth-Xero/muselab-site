import React, { useState, useEffect } from "react";
import Head from "next/head";
import Nav from "../components/nav";
import { showError, showSuccess, showWarning } from "../utils/verify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parseJwt from "../utils/parse";

const API = "https://api.muselab.app/api/account";

const inputClass =
    "w-full h-12 px-4 py-2 text-sm sm:text-base lg:text-lg ring-1 backdrop-blur-sm ring-slate-600 bg-slate-700/40 rounded-lg text-white placeholder:text-slate-400 font-regular focus:outline-none hover:bg-slate-600/60 focus:bg-slate-600/60 duration-300 ease-in-out";
const btnClass =
    "w-full h-12 px-4 py-2 mt-2 text-sm sm:text-base lg:text-lg font-black ring-1 backdrop-blur-sm ring-teal-500/90 bg-teal-500/90 rounded-lg text-white focus:outline-none hover:bg-teal-700/90 duration-300 ease-in-out";
const disabledInputClass =
    "w-full h-12 px-4 py-2 text-sm sm:text-base lg:text-lg ring-1 ring-slate-700 bg-slate-800/40 rounded-lg text-white/50 font-regular cursor-not-allowed";
const labelClass = "text-white/40 text-xs lg:text-sm -mb-2";

export default function Account() {
    const [me, setMe] = useState({ username: "", email: "", roles: [] });

    const [newUsername, setNewUsername] = useState("");
    const [usernamePassword, setUsernamePassword] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const getToken = () => {
        const t = localStorage.getItem("accessToken");
        const p = parseJwt(t);              
        if (!t || !p || p.exp * 1000 < Date.now()) {
            localStorage.clear();
            window.location.href = "/login";
            return null;
        }
        return t;
    };

    const authHeaders = (json) => {
        const t = getToken();
        if (!t) return null;
        const h = { Authorization: "Bearer " + t };
        if (json) h["Content-Type"] = "application/json";
        return h;
    };

    const loadMe = () => {
        fetch(API + "/me", { method: "GET", headers: authHeaders(false) })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load account info.");
                return res.json();
            })
            .then((data) => {
                setMe(data);
                setNewUsername(data.username || "");
                setNewEmail(data.email || "");
            })
            .catch((err) => showError(err.message));
    };

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "/login";
        } else {
            loadMe();
        }
    }, []);

    const post = (path, body, onOk) => {
        fetch(API + path, {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify(body),
        })
            .then((res) =>
                res
                    .json()
                    .then((data) => {
                        if (!res.ok) {
                            throw new Error(data.message || "Request failed.");
                        }
                        onOk(data);
                    })
                    .catch((err) => showError(err.message))
            )
            .catch((err) => showError(err.message));
    };

    const submitUsername = (e) => {
        e.preventDefault();
        if (!newUsername || newUsername.length < 3 || newUsername.length > 20) {
            showError("Username must be between 3 and 20 characters.");
            return;
        }
        if (!usernamePassword) {
            showError("Enter your current password to confirm.");
            return;
        }
        post(
            "/change_username",
            { password: usernamePassword, newUsername },
            (data) => {
                showSuccess(data.message || "Username updated.");
                localStorage.setItem("username", newUsername);
                setUsernamePassword("");
                loadMe();
            }
        );
    };

    const submitEmail = (e) => {
        e.preventDefault();
        if (!newEmail) {
            showError("Email cannot be empty.");
            return;
        }
        if (!emailPassword) {
            showError("Enter your current password to confirm.");
            return;
        }
        post("/change_email", { password: emailPassword, newEmail }, (data) => {
            showWarning(
                data.message || "Check your inbox to verify your new email."
            );
            setEmailPassword("");
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 8) {
            showError("New password must be at least 8 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }
        post(
            "/update_password",
            { password: currentPassword, newPassword },
            (data) => {
                showSuccess(data.message || "Password updated.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        );
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Head>
                <title>MuseLab Account</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Nav fixed={true} />
            <ToastContainer />
            <main className="w-screen min-h-screen pt-28 pb-24 flex flex-col items-center bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-6 md:px-20 lg:px-32">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 text-center">
                    Account <b className="text-teal-400">settings</b>
                </h1>
                <p className="text-white/50 font-medium text-sm lg:text-base mb-10 text-center">
                    Signed in as <b className="text-white/80">{me.username}</b>
                    {me.roles && me.roles.length > 0 && (
                        <span className="text-white/40">
                            {" "}
                            ({me.roles.join(", ").replaceAll("ROLE_", "")})
                        </span>
                    )}
                </p>

                <div className="w-full max-w-xl flex flex-col gap-8">
                    <form
                        className="flex flex-col gap-4 p-6 lg:p-8 rounded-lg ring-1 backdrop-blur-sm ring-slate-600 bg-blue-950/30"
                        onSubmit={submitUsername}
                    >
                        <h2 className="text-xl lg:text-2xl font-black text-white">
                            Change username
                        </h2>
                        <label className={labelClass}>Current username</label>
                        <input
                            type="text"
                            className={disabledInputClass}
                            value={me.username}
                            disabled
                            readOnly
                        />
                        <label className={labelClass}>New username</label>
                        <input
                            type="text"
                            placeholder="New username"
                            className={inputClass}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Current password"
                            className={inputClass}
                            value={usernamePassword}
                            onChange={(e) => setUsernamePassword(e.target.value)}
                        />
                        <button type="submit" className={btnClass}>
                            Update username
                        </button>
                    </form>

                    <form
                        className="flex flex-col gap-4 p-6 lg:p-8 rounded-lg ring-1 backdrop-blur-sm ring-slate-600 bg-blue-950/30"
                        onSubmit={submitEmail}
                    >
                        <h2 className="text-xl lg:text-2xl font-black text-white">
                            Change email
                        </h2>
                        <p className="text-white/40 text-xs lg:text-sm -mt-2">
                            A verification link will be sent to the new address. The change
                            applies only after you verify it.
                        </p>
                        <label className={labelClass}>Current email</label>
                        <input
                            type="email"
                            className={disabledInputClass}
                            value={me.email}
                            disabled
                            readOnly
                        />
                        <label className={labelClass}>New email</label>
                        <input
                            type="email"
                            placeholder="New email"
                            className={inputClass}
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Current password"
                            className={inputClass}
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                        />
                        <button type="submit" className={btnClass}>
                            Update email
                        </button>
                    </form>

                    <form
                        className="flex flex-col gap-4 p-6 lg:p-8 rounded-lg ring-1 backdrop-blur-sm ring-slate-600 bg-blue-950/30"
                        onSubmit={submitPassword}
                    >
                        <h2 className="text-xl lg:text-2xl font-black text-white">
                            Change password
                        </h2>
                        <input
                            type="password"
                            placeholder="Current password"
                            className={inputClass}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New password (min 8 characters)"
                            className={inputClass}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className={inputClass}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" className={btnClass}>
                            Update password
                        </button>
                    </form>
                </div>
            </main>
            <footer className="w-screen h-20 flex flex-row justify-center items-center bg-transparent">
                <p className="text-white/20 font-medium text-sm">
                    Not affiliated with MuseScore.
                </p>
            </footer>
        </div>
    );
}