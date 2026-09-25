import styles from './ItemProfile.module.css'

export default function ItemProfile({ image, imageAlt = '', kicker, title, children, footer, extra }) {
  return (
    <article className={styles.profile}>
      <div className={`container ${styles.layout} ${image ? '' : styles.layoutText}`}>
        {image ? (
          <figure className={styles.portrait}>
            <img src={image} alt={imageAlt} />
          </figure>
        ) : null}
        <div className={styles.copy}>
          {kicker ? <p className={styles.role}>{kicker}</p> : null}
          {title ? <h1 className={styles.name}>{title}</h1> : null}
          {children}
          {footer ? <div className={styles.actions}>{footer}</div> : null}
        </div>
      </div>
      {extra ? <div className={`container ${styles.extra}`}>{extra}</div> : null}
    </article>
  )
}

export { styles as itemProfileStyles }
