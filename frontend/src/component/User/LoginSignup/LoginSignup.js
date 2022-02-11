import React, { useEffect, useRef, useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../../images/Profile.png";
import "./loginSignup.css";
import { clearErrors, login, register } from "../../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../../layout/loader/Loader";

const LoginSignup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, isAuthenticated, error } = useSelector(
        (state) => state.user
    );
    const alert = useAlert();
    console.log("search", window.location.search);
    const redirect = window.location.search //query part of url including ?
        ? window.location.search.split("=")[1]
        : "account";
    console.log("redirect", redirect);
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate(`/${redirect}`);
        }
    }, [error, alert, dispatch, isAuthenticated, navigate, redirect]);
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState(Profile);
    const [avatarPreview, setAvatarPreview] = useState(Profile);

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            // read file

            reader.onload = () => {
                if (reader.readyState === 2) {
                    // 3 states initial processing done
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    };
    const registerSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);
        dispatch(register(myForm));
    };
    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    };
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="LoginSignUpContainer">
                    <div className="LoginSignUpBox">
                        <div>
                            <div className="login_signUp_toggle">
                                <p onClick={(e) => switchTabs(e, "login")}>
                                    LOGIN
                                </p>
                                <p onClick={(e) => switchTabs(e, "register")}>
                                    REGISTER
                                </p>
                            </div>
                            <button ref={switcherTab}></button>
                        </div>
                        <form
                            className="loginForm"
                            ref={loginTab}
                            // using ref to change classes
                            onSubmit={loginSubmit}
                        >
                            <div className="loginEmail">
                                <MailOutlineIcon />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) =>
                                        setLoginEmail(e.target.value)
                                    }
                                />
                            </div>
                            <div className="loginPassword">
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) =>
                                        setLoginPassword(e.target.value)
                                    }
                                />
                            </div>
                            <Link to="/password/forgot">Forget Password ?</Link>
                            <input
                                type="submit"
                                value="Login"
                                className="loginBtn"
                            />
                        </form>
                        <form
                            className="signUpForm"
                            ref={registerTab}
                            encType="multipart/form-data" //for input type = file
                            onSubmit={registerSubmit}
                        >
                            <div className="signUpName">
                                <FaceIcon />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    name="name"
                                    value={name}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signUpEmail">
                                <MailOutlineIcon />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signUpPassword">
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    name="password"
                                    value={password}
                                    onChange={registerDataChange}
                                />
                            </div>

                            <div id="registerImage">
                                <img src={avatarPreview} alt="Avatar Preview" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*" //accept image od all type
                                    onChange={registerDataChange}
                                />
                            </div>
                            <input
                                type="submit"
                                value="Register"
                                className="signUpBtn"
                            />
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginSignup;
