'use client';

import Image from 'next/image';
import { useCv } from '@/providers/CvProvider';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import styles from './style.module.scss';

export function Hero() {
  const { cv, labels } = useCv();
  const { basics } = cv;
  const { city, country } = basics.location;

  return (
    <div className={styles['myui-cv-hero']}>
      {/* Top bar: location + language switch */}
      <div className={styles['top-bar']}>
        <p className={styles.location}>
          {city}, {country}
        </p>
        <LanguageSwitch />
      </div>

      {/* Body: identity text + profile photo */}
      <div className={styles.body}>
        <div className={styles['text-block']}>
          <hgroup>
            <h1 className={styles.name}>{basics.fullName}</h1>
            <p className={styles.headline}>{basics.headline}</p>
          </hgroup>
          <p className={styles.summary}>{basics.summary}</p>
          <div className={styles.actions}>
            <a
              href="#contact"
              className="inline-flex items-center rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {labels.contactMe}
            </a>
          </div>
        </div>

        {/* Photo — decorative (name is in text), hidden on mobile + print */}
        <div className={styles['photo-wrapper']} aria-hidden="true" role="presentation">
          <Image
            src="/photo.png"
            alt=""
            width={128}
            height={128}
            priority
            className={styles.photo}
          />
        </div>
      </div>
    </div>
  );
}
