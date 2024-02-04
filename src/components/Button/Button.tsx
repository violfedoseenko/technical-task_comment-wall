import { ButtonHTMLAttributes, FC } from 'react';
import cls from './Button.module.scss';

export const Button:FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
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