import { Card, CardDescription, CardHeader } from '@/components/ui/card'

export const EmptyDataFetch = ({ message }: { message: string }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription className="text-center">{message}</CardDescription>
      </CardHeader>
    </Card>
  )
}
