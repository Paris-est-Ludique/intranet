import React, { FC } from "react"
import styles from "./styles.module.scss"

type Props = {
    children: React.ReactNode
}

const Page: FC<Props> = ({ children }): JSX.Element => (
    <div className={styles.pageWrapper}>
        {React.Children.map(children, (child) => (
            <div className={styles.pageContent}>{child}</div>
        ))}
    </div>
)

export default Page
