import type { FC } from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'

interface Props {
  title: string
}

const ContentTitle: FC<Props> = ({ title }): JSX.Element => (
  <h2 className={styles.title}>{title}</h2>
)

export default memo(ContentTitle)
