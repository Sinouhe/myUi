import type { SectionHeadingProps } from './type';
import styles from './style.module.scss';

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2 id={id} className={styles['myui-cv-section-heading']}>
      {children}
    </h2>
  );
}
