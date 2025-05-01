import { DepartmentWelcome } from './department'
import { WelcomeHero } from './hero'
import { OptionWelcome } from './option'
import { Presentation } from './presentation'
import { YourAdn } from './adn-section'

export default function Home() {
  return (
    <div className="space-y-10">
      <WelcomeHero />
      <YourAdn />
      <Presentation />
      <DepartmentWelcome />
      <OptionWelcome />
    </div>
  )
}
