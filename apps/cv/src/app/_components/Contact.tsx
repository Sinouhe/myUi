import { contactLinks } from './content';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading id="contact-heading">Contact</SectionHeading>
      <p className="mb-8 max-w-md text-base leading-relaxed text-zinc-600">
        Available for new opportunities and consulting engagements. Feel free to reach out by
        email or connect on LinkedIn.
      </p>
      <dl className="space-y-3">
        {contactLinks.map((link) => (
          <div key={link.label} className="flex gap-6 text-sm">
            <dt className="w-20 shrink-0 font-medium text-zinc-500">{link.label}</dt>
            <dd>
              <a
                href={link.href}
                className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {link.display}
                {!link.href.startsWith('mailto:') && (
                  <span className="sr-only"> (opens in new tab)</span>
                )}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
