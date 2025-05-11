import { DepartmentWelcome } from '@/features/welcome/department'
import { WelcomeHero } from '@/features/welcome/hero'
import { OptionWelcome } from '@/features/welcome/option'
import { Presentation } from '@/features/welcome/presentation'
import { YourAdn } from '@/features/welcome/adn-section'
import { FaqWelcome } from '@/features/welcome/faq'
import { ProfessorLeaders } from '@/features/welcome/professor-leader'
import { BaseLayout } from '@/layouts/base-layout'
import { YearAcademicWelcome } from '@/features/welcome/year-academic'

export default function HomePage() {
  return (
    <BaseLayout>
      <main className="py-12">
        <div className="space-y-12">
          <WelcomeHero />
          <YourAdn />
          <Presentation />
          <YearAcademicWelcome />
          <DepartmentWelcome />
          <OptionWelcome />
          <ProfessorLeaders />
          <FaqWelcome />
        </div>
      </main>
    </BaseLayout>
  )
}
