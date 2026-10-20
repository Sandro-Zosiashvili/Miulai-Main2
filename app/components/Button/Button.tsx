'use client'
import styles from "./Button.module.scss";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ButtonHelper, { ButtonProps } from "@/app/helpers/ButtonHelper";


const Button = (props: ButtonProps) => {
    const { classes, style } = ButtonHelper(props);
    const isLoading = !!props.loading;


    return (
        <button
            type="submit"
            disabled={props.disabled || isLoading}
            className={classes.join(' ').trim()}
            style={{ ...style, ...(isLoading ? { opacity: 0.85, cursor: "wait" } : {}) }}
            onClick={props.onClick}
        >
            {isLoading ? (
                <span className={styles.spinner} role="status" aria-label="loading" />
            ) : (
                <>
                    {props.imageSrc && props.imageWidth && props.imageHeight && (
                        <Image
                            src={`../icon/${props.imageSrc}`}
                            width={props.imageWidth}
                            height={props.imageHeight}
                            alt={props.imageAlt || "button-icon"}
                        />
                    )}
                    {props.title}
                </>
            )}
        </button>
    )
}


export default Button;