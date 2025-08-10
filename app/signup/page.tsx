'use client'
import axios from 'axios';
import Button from '../components/Button/Button'
import styles from './page.module.scss'
import Image from 'next/image'
import {useForm} from "react-hook-form";
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Spin} from "antd";


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


    const onSubmit = (values: RegisterForm) => {
        setLoading(true);
        const password = watch('password')
        const currentpassword = watch('RepeatPassword')
        if (password === currentpassword) {
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, values).then(r => {
                router.push('/signin')
                setLoading(false);
            }).catch(() => {
                setLoading(false);

            })

        }

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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.registracion}>
                        <input
                            className={styles.input}
                            type='text'
                            placeholder='name'
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Enter your name'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'MinLength is 2'
                                },
                            })}
                        />
                        {
                            errors.name && <div className={styles.errorMassage}>{errors.name.message}</div>
                        }

                        <input className={styles.input}
                               type='email'
                               placeholder='Email'
                               {...register('email', {
                                   required: {
                                       value: true,
                                       message: 'Email is required'
                                   },
                                   pattern: {
                                       value: /\S+@\S+\.\S+/,
                                       message: "Enter correct Email"
                                   }
                               })}
                        />
                        {
                            errors.email &&
                            <div className={styles.errorMassage}>{errors.email.message}</div>
                        }

                        <div className={styles.passwordInput}>
                            <input
                                className={styles.inputPassword}
                                type={passwordHide}
                                placeholder='Password'
                                {...register('password', {
                                    required: true,
                                    minLength: 8,

                                })}
                            />

                            <div className={styles.cursor}
                                 onClick={() => passwordHide === 'text' ? setPasswordHide('password') : setPasswordHide('text')}>
                                <Image src={'./icon/hide.svg'} width={16} height={16} alt='hide'/>
                            </div>

                        </div>


                        <div className={styles.registrationErors}>
                            <div>Password must Contain:</div>
                            <div>*8 or more Characters</div>
                        </div>

                        <div className={styles.passwordInput}>
                            <input className={styles.inputPassword}
                                   type={passwordHide}
                                   placeholder='current Password'
                                   {...register('RepeatPassword', {
                                       required: {
                                           value: true,
                                           message: 'Current Password is required'
                                       },

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
                        <div className={styles.button}>
                            {loading ? (
                                <div className={styles.loading}>
                                    <Spin tip="Submitting..." size="large"/>
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
