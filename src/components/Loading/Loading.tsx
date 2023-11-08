import styles from './styles.module.scss'

export default function Loading(): JSX.Element {
  return (
    <div className={styles.loading}>
      <p>Loading...</p>
    </div>
  )
}
