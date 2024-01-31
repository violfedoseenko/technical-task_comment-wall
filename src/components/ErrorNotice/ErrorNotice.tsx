import { Button } from '../Button/Button'
import cls from './ErrorNotice.module.scss'

const ErrorNotice: React.FC = () => {

	const reloadPage = () => {
		// eslint-disable-next-line no-restricted-globals
		location.reload()
	}

    return (
		<div className={cls.error_block}>
			<p>Oops..something went wrong...</p>
			<p>Please, reload page</p>
			<Button onClick={reloadPage}>Reload page</Button>
		</div>
    )
}

export default ErrorNotice