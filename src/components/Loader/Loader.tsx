import cls from './Loader.module.scss'

const Loader: React.FC = () => {

    return (
		<div className={cls.lds_ripple}>
			<div></div>
			<div></div>
		</div>
    )
}

export default Loader