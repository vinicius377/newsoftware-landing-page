import React from "react";
import styles from "./styles.module.scss";
import type { UseFormRegister } from "react-hook-form";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  name: string
  register?: UseFormRegister<any>;
  error?: string
}

export default function TextField({ title, register, error, ...rest }: TextFieldProps) {
  const registerProps = register ? register(rest.name) : {}
  return (
    <label className={styles.label}>
      <span>
        {title}
        {rest.required && <b className={styles.required}>*</b>}
      </span>
      <input {...rest} {...registerProps}/>
      <span className={styles.error}>{error}</span>
    </label>
  );
}
