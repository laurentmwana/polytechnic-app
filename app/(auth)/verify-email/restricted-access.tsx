"use client"

import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function RestrictedAccess() {
  const router = useRouter()

  return (
    <Card className="rounded-xl">
      <CardHeader className="px-10 pt-8 pb-0 text-center">
        <CardTitle className="text-xl">Accès restreint</CardTitle>
      </CardHeader>
      <CardContent className="px-10 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Vous devez vous connecter pour accéder à cette page.</AlertDescription>
        </Alert>
        <Button className="w-full" onClick={() => router.push("/login")}>
          Se connecter
        </Button>
      </CardContent>
    </Card>
  )
}
