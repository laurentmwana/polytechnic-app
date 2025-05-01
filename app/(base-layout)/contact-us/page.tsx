'use client'

import { Heading } from '@/components/shared/heading'
import { ContactInfo } from './contact-info'
import { ContactForm } from './contact-form'

export default function ContactUs() {
  return (
    <div className="container py-12">
      <Heading
        title="Nous contacter"
        description="Vous avez un problème technique ? Vous souhaitez envoyer des commentaires sur une fonctionnalité bêta ? Faites-le nous savoir."
      />

      <div className="w-full">
        {' '}
        {/* Plus large pour la grille */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 w-full">
            <ContactInfo />
          </div>
          <div className="lg:col-span-2 w-full">
            <div className="container-card w-full">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
