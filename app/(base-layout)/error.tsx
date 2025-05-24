"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.error("Application Error:", error)
  }, [error])

  const handleRetry = async () => {
    setIsRetrying(true)

    // Petit délai pour montrer l'état de chargement
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      reset()
    } catch (err) {
      console.error("Retry failed:", err)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-destructive/20 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            {/* Icône d'erreur */}
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            {/* Titre et message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground">Oups ! Une erreur est survenue</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nous nous excusons pour ce désagrément. Une erreur inattendue s&#39;est produite.
              </p>
            </div>

            {/* Détails de l'erreur (optionnel, pour le développement) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Détails de l&#39;erreur
                  </span>
                </div>
                <code className="text-xs text-destructive break-all">{error.message}</code>
                {error.digest && <div className="mt-2 text-xs text-muted-foreground">ID: {error.digest}</div>}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button onClick={handleRetry} disabled={isRetrying} className="w-full" size="lg">
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Rechargement...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleGoHome} className="w-full" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Retour à l&#39;accueil
              </Button>
            </div>

            {/* Message de support */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Si le problème persiste, veuillez contacter le support technique.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">Université de Kinshasa - Système de gestion académique</p>
        </div>
      </div>
    </div>
  )
}
