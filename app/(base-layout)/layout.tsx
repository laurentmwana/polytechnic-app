import { NavbarBase } from '@/components/shared/navbar'
import { NetworkSocial } from '@/components/shared/network-social'
import { webRoute } from '@/lib/route'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <NavbarBase />
      <main>{children}</main>

      <div className="container pt-[100px]">
        <footer className="py-8" id="footer">
          <div className="container-center">
            <div className="container-center grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100">
                  Faculté Polytechnique
                </h2>
                <p className="text-description mb-4">
                  La Faculté Polytechnique de l&#39;Université de Kinshasa
                  (UNIKIN) est un pôle d&#39;excellence en ingénierie et en
                  technologie, formant depuis des décennies les leaders de
                  demain dans les domaines scientifiques et industriels
                </p>

                <NetworkSocial />
              </div>
              <div className="flex md:justify-end">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Nous contacter</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href={webRoute('contact.index')}
                        className="flex gap-x-2 hover:underline"
                      >
                        <i className="bi bi-envelope text-blue-500 hover:text-blue-600"></i>
                        <span className="text-muted-foreground">
                          Par e-mail
                        </span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="https://api.whatsapp.com/send/?phone=243829760292&text&type=phone_number&app_absent=0"
                        className="flex gap-x-2 hover:underline"
                      >
                        <i className="bi bi-whatsapp text-green-500 hover:text-green-600"></i>
                        <span className="text-muted-foreground">
                          Par Whatsapp
                        </span>
                      </a>
                    </li>
                  </ul>
                  <div className="text-description mt-3 pl-2 text-start">
                    <span>développé par </span>
                    <a
                      target="_blank"
                      href="https://github.com/laurentmwana"
                      className="text-slate-900 underline dark:text-gray-300"
                    >
                      Labeya
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600">
            &copy; Faculté Polytechnique {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default BaseLayout
