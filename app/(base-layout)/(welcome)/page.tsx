import { DepartmentWelcome } from './department'
import { WelcomeHero } from './hero'
import { OptionWelcome } from './option'
import { Presentation } from './presentation'
import { YourAdn } from './adn-section'
import { FaqWelcome } from './faq'
import { ProfessorLeaders } from './professor-leader'

export default function Home() {
  return (
    <div className="space-y-10">
      <WelcomeHero />
      <YourAdn />
      <Presentation />
      <DepartmentWelcome />
      <OptionWelcome />
      <ProfessorLeaders />
      <FaqWelcome />
    </div>
  )
}
