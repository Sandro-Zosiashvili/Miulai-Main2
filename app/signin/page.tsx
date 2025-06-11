"use client";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import Button from "../components/Button/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import { useRouter } from "next/navigation";
import { setCookie } from "../cookies";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Spin } from "antd";
import { userIDState } from "../state";

type SignIn = {
  email: string;
  password: string;
  remember: boolean;
};

const Signup = () => {
  const [useID, setUserID] = useRecoilState(userIDState)
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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
    setLoading(true)
    axios
      .post("https://backend.miulai.ge/auth", values)
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
        window.location.reload()
      }).catch(() => {
        setLoading(false)
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
          >
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                {...register("email", {
                  required: {
                    value: true,
                    message: "email is required",
                  },
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}

              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={styles.inputPassword}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "password is required",
                    },
                    minLength: {
                      value: 8,
                      message: "min length of password should be 8 character",
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
            {loading ? (
                <div className={styles.loading}>
                    <Spin tip="Submitting..." size="default" />
                </div>
            ) : (
              <Button
              title={"SIGN IN"}
              mode={"reusable button"}
              onClick={() => console.log("button clicked")}
              width="340px"
              padding="12px"
              borderRadius="8px"
              fontSize="16px"
            />
            )}
            
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
