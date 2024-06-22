import React from "react";
import styles from "./styles.module.scss";
import type { UseFormRegister } from "react-hook-form";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  name: string
  register: UseFormRegister<any>
}

export default function TextField({ title, register, ...rest }: TextFieldProps) {
  return (
    <label className={styles.label}>
      <span>
        {title}
        {rest.required && <b className={styles.required}>*</b>}
      </span>
      <input {...rest} {...register(rest.name)}/>
      <span className={styles.error}></span>
    </label>
  );
}
