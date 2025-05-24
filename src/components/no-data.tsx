import { Alert, AlertDescription } from './ui/alert'

export const EmptyDataFetch = ({ message }: { message: string }) => {
  return (
    <div className="max-w-xl mx-auto">
      <Alert>
        <AlertDescription className="text-center">{message}</AlertDescription>
      </Alert>
    </div>
  )
}
