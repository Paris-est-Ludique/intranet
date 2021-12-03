import { RouteComponentProps } from "react-router-dom"
import { useDispatch } from "react-redux"
import { FC, memo } from "react"
import { Helmet } from "react-helmet"
import styles from "./styles.module.scss"
import RegisterForm from "../../components/RegisterForm/RegisterForm"

export type Props = RouteComponentProps

const RegisterPage: FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    return (
        <div className={styles.registerPage}>
            <div className={styles.registerContent}>
                <Helmet title="RegisterPage" />
                <RegisterForm dispatch={dispatch} />
            </div>
        </div>
    )
}

export default memo(RegisterPage)
