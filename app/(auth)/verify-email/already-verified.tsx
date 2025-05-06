"use client"

import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function AlreadyVerified() {
  const router = useRouter()

  return (
    <Card className="rounded-xl">
      <CardHeader className="px-10 pt-8 pb-0 text-center">
        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-xl">Vérification</CardTitle>
      </CardHeader>
      <CardContent className="px-10 py-8">
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Votre adresse e-mail est déjà vérifiée</AlertDescription>
        </Alert>
        <Button className="w-full" onClick={() => router.push("/")}>
          Aller à la page d&apos;accueil
        </Button>
      </CardContent>
    </Card>
  )
}
