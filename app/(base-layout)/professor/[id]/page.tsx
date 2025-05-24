import { ProfessorInfoShow } from './professor-show'

export default async function ProfessorShow({
  params,
}: {
  params: Promise<{ id: string | number }>
}) {
  const { id } = await params

  return <ProfessorInfoShow id={id} />
}
