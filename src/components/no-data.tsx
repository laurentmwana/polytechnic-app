import { Card, CardDescription, CardHeader } from '@/components/ui/card'

export const EmptyDataFetch = ({ message }: { message: string }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  )
}
