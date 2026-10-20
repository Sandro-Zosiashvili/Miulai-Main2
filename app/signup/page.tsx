'use client'
import axios from 'axios';
import Button from '../components/Button/Button'
import styles from './page.module.scss'
import Image from 'next/image'
import {useForm} from "react-hook-form";
import {useState} from 'react';
import {useRouter} from 'next/navigation';


interface RegisterForm {
    name: string,
    email: string,
    password: string,
    RepeatPassword: string,
}


const Registracion = () => {
    const router = useRouter()
    const [passwordHide, setPasswordHide] = useState<string>('password')
    const {register, handleSubmit, watch, formState: {errors}} = useForm<RegisterForm>();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>("");


    const onSubmit = (values: RegisterForm) => {
        setLoading(true);
        setApiError("");
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, values)
            .then(() => {
                router.push('/signin');
            })
            .catch((error) => {
                setLoading(false);
                const status = error?.response?.status;
                if (status === 409) {
                    setApiError("This email is already registered.");
                } else if (status === 400 || status === 401) {
                    setApiError("Please check your details and try again.");
                } else {
                    setApiError("Registration failed. Please try again.");
                }
            });
    }


    return (
        <div className={styles.container}>
            <div className={styles.logoTablet}>
                <Image src={'/icon/logo.svg'} alt='image' width={97} height={83}/>
            </div>
            <div className={styles.cellStructure}>
                <div className={styles.logoDesktop}>
                    <Image src={'/icon/logo.svg'} alt='image' width={97} height={83}/>
                </div>

                <div className={styles.subtitle}>
                    <div className={styles.firstFont}>
                        Where <span>Harmony</span>
                    </div>
                    <div className={styles.secondFont}>
                        <span>Meets</span> Melody
                    </div>
                    <div className={styles.thirdFont}>The Future Of Music Streaming</div>
                </div>
                <div className={styles.tabletFont}>Sign up</div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.registracion}>
                        <input
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                            type='text'
                            placeholder='Name'
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Name is required'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters'
                                },
                            })}
                        />
                        {
                            errors.name && <div className={styles.errorMassage}>{errors.name.message}</div>
                        }

                        <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                               type='email'
                               placeholder='Email'
                               {...register('email', {
                                   required: {
                                       value: true,
                                       message: 'Email is required'
                                   },
                                   pattern: {
                                       value: /\S+@\S+\.\S+/,
                                       message: "Enter a valid email address"
                                   }
                               })}
                        />
                        {
                            errors.email &&
                            <div className={styles.errorMassage}>{errors.email.message}</div>
                        }

                        <div className={`${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}>
                            <input
                                className={styles.inputPassword}
                                type={passwordHide}
                                placeholder='Password'
                                {...register('password', {
                                    required: {
                                        value: true,
                                        message: 'Password is required'
                                    },
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters'
                                    },
                                })}
                            />

                            <div className={styles.cursor}
                                 onClick={() => passwordHide === 'text' ? setPasswordHide('password') : setPasswordHide('text')}>
                                <Image src={'./icon/hide.svg'} width={16} height={16} alt='hide'/>
                            </div>

                        </div>
                        {
                            errors.password &&
                            <div className={styles.errorMassage}>{errors.password.message}</div>
                        }


                        <div className={styles.registrationErors}>
                            <div>Password must Contain:</div>
                            <div>*8 or more Characters</div>
                        </div>

                        <div className={`${styles.passwordInput} ${errors.RepeatPassword ? styles.inputError : ''}`}>
                            <input className={styles.inputPassword}
                                   type={passwordHide}
                                   placeholder='Confirm Password'
                                   {...register('RepeatPassword', {
                                       required: {
                                           value: true,
                                           message: 'Please confirm your password'
                                       },
                                       validate: (value) =>
                                           value === watch('password') || "Passwords don't match",
                                   })}
                            />
                            <div className={styles.cursor}
                                 onClick={() => passwordHide === 'text' ? setPasswordHide('password') : setPasswordHide('text')}>
                                <Image src={'./icon/hide.svg'} width={16} height={16} alt='hide'/>
                            </div>
                        </div>

                        {
                            errors.RepeatPassword &&
                            <span className={styles.errorMassage}>{errors.RepeatPassword.message}</span>
                        }

                        {apiError && <div className={styles.apiError}>{apiError}</div>}

                        <div className={styles.button}>
                            <Button
                                title={"SIGN UP"}
                                mode={"reusable button"}
                                loading={loading}
                                onClick={() => {}}
                                width="340px"
                                padding="12px"
                                borderRadius="8px"
                                fontSize="16px"
                            />
                        </div>
                        <div className={styles.haveAnAccount}>
                            <div>Already have an account?</div>
                            <div onClick={() => router.push('/signin')} className={styles.signInButton}>Sign in</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>


    )

}


export default Registracion
