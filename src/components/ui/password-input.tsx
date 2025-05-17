'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <style jsx global>{`
        /* Hide default browser password reveal icon */
        input::-ms-reveal,
        input::-ms-clear,
        input::-webkit-credentials-auto-fill-button,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-reveal {
          display: none !important;
          pointer-events: none;
        }

        /* For Safari */
        input::-webkit-textfield-decoration-container {
          visibility: hidden;
        }
      `}</style>
      <Input
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        spellCheck={false}
        className={cn('pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={
          showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
        }
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}
