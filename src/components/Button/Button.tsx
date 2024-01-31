import { ButtonHTMLAttributes, FC } from 'react';
import cls from './Button.module.scss';


// type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> 

export const Button = (props:any) => {
    const {
        children,
        ...otherProps
    } = props;

    return (
        <button
            type="button"
            {...otherProps}
			className={cls.button}
        >
            {children}
        </button>
    );
};