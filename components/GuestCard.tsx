import Image from 'next/image';
import type { Guest } from '@/content/types';

export function GuestCard({ guest }: { guest: Guest }) {
  return (
    <section className="invite regle" aria-labelledby="titre-invite">
      <h2 id="titre-invite" className="label invite__surtitre">
        L’invité
      </h2>

      <div className="invite__corps">
        {guest.portrait && (
          <div className="photo photo--braise invite__portrait" data-reveal="pending">
            <Image
              src={guest.portrait.src}
              alt={guest.portrait.alt}
              width={guest.portrait.width}
              height={guest.portrait.height}
              sizes="(max-width: 899px) 45vw, 22vw"
              loading="lazy"
            />
          </div>
        )}

        <div className="invite__texte">
          <p className="invite__nom h2">{guest.name}</p>
          <p className="invite__fonction lede">
            {guest.role}
            <span aria-hidden="true"> — </span>
            {guest.company}
          </p>
          <p className="invite__bio prose">{guest.bio}</p>

          <ul className="invite__liens">
            {guest.linkedin && (
              <li>
                <a className="lien label" href={guest.linkedin} target="_blank" rel="noreferrer noopener">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
            )}
            {guest.website && (
              <li>
                <a className="lien label" href={guest.website} target="_blank" rel="noreferrer noopener">
                  Site de l’entreprise <span aria-hidden="true">↗</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
