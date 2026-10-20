"use client";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import Button from "../components/Button/Button";
import {useForm} from "react-hook-form";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import {useRouter} from "next/navigation";
import {setCookie} from "../cookies";
import {useState, useEffect} from "react";
import {useRecoilState} from "recoil";
import {userIDState} from "../state";

type SignIn = {
    email: string;
    password: string;
    remember: boolean;
};

const Signup = () => {
    const [, setUserID] = useRecoilState(userIDState);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>("");
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<SignIn>();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");

        if (savedEmail) {
            setValue("email", savedEmail);
        }
        if (savedPassword) {
            setValue("password", savedPassword);
        }

        setRememberMe(!!(savedEmail && savedPassword));
    }, [setValue]);

    const onLogin = (values: SignIn) => {
        setLoading(true);
        setApiError("");
        axios
            .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, values)
            .then((r) => {

                setCookie("token", r.data.accessToken, 60);
                if (rememberMe) {
                    localStorage.setItem("email", values.email);
                    localStorage.setItem("password", values.password);
                } else {
                    localStorage.removeItem("email");
                    localStorage.removeItem("password");
                }
                router.push("/");
                window.location.reload();
            })
            .catch((error) => {
                setLoading(false);
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    setApiError("Incorrect email or password.");
                } else if (status === 400) {
                    setApiError("Please check your details and try again.");
                } else {
                    setApiError("Something went wrong. Please try again.");
                }
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div>
                    <div className={styles.logoWrapper}>
                        <Image
                            src={"/icon/logo.svg"}
                            alt="image"
                            width={97}
                            height={83}
                            className={styles.logo}
                        />
                    </div>
                    <h1 className={styles.header}>
                        <p className={styles.white}>
                            <span>Where</span>
                            <span>Harmony</span>
                        </p>
                        <p className={styles.gradients}>
                            <span>Meets</span>
                            <span>Melody</span>
                        </p>
                    </h1>
                    <p className={styles.subtitle}>The Future Of Music Streaming</p>
                    <span className={styles.signInTitle}>Sign In</span>

                    <form
                        onSubmit={handleSubmit(onLogin)}
                        className={styles.formsWrapper}
                        noValidate
                    >
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required",
                                    },
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <ErrorMessage>{errors.email.message}</ErrorMessage>
                            )}

                            <div className={`${styles.passwordWrapper} ${errors.password ? styles.inputError : ""}`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className={styles.inputPassword}
                                    {...register("password", {
                                        required: {
                                            value: true,
                                            message: "Password is required",
                                        },
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                    })}
                                />
                                <Image
                                    onClick={togglePasswordVisibility}
                                    src={
                                        showPassword
                                            ? "/icon/show-password.svg"
                                            : "/icon/hide-showPass.svg"
                                    }
                                    alt="image"
                                    width={16}
                                    height={16}
                                    className={styles.passwordImg}
                                />
                            </div>
                            {errors.password && (
                                <ErrorMessage>{errors.password.message}</ErrorMessage>
                            )}
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <div className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    {...register("remember")}
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <span className={styles.remember}>Remember me</span>
                            </div>
                            <Link href={"/"} className={styles.forgot}>
                                Forgot your password?
                            </Link>
                        </div>

                        {apiError && <div className={styles.apiError}>{apiError}</div>}

                        <Button
                            title={"SIGN IN"}
                            mode={"reusable button"}
                            loading={loading}
                            onClick={() => {}}
                            width="340px"
                            padding="12px"
                            borderRadius="8px"
                            fontSize="16px"
                        />

                    </form>
                    <div className={styles.signup}>
                        <span>Don’t have an account?</span>
                        <span onClick={() => router.push("/signup")}>Sign up</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
