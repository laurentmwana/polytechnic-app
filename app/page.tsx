import { DepartmentWelcome } from '@/features/welcome/department'
import { WelcomeHero } from '@/features/welcome/hero'
import { OptionWelcome } from '@/features/welcome/option'
import { Presentation } from '@/features/welcome/presentation'
import { YourAdn } from '@/features/welcome/adn-section'
import { FaqWelcome } from '@/features/welcome/faq'
import { BaseLayout } from '@/layouts/base-layout'
import { YearAcademicWelcome } from '@/features/welcome/year-academic'

export default function HomePage() {
  return (
    <BaseLayout>
      <main className="py-12">
        <WelcomeHero />
        <div className="space-y-16">
          <YourAdn />
          <Presentation />
          <YearAcademicWelcome />
          <DepartmentWelcome />
          <OptionWelcome />
          <FaqWelcome />
        </div>
      </main>
    </BaseLayout>
  )
}
