import type { FC, ReactNode } from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'
import ContentTitle from './ContentTitle'

interface Props {
  children: ReactNode
  title?: string | null
}

const ContentBlock: FC<Props> = ({ children, title }): JSX.Element => (
  <div>
    {title && <ContentTitle title={title} />}
    <div className={styles.content}>{children}</div>
  </div>
)

ContentBlock.defaultProps = {
  title: null,
}

export default memo(ContentBlock)
