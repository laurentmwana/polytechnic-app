"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  return (
    <div className="flex justify-center">
      <InputOTP maxLength={6} value={value} onChange={onChange}>
        <InputOTPGroup className="gap-2 sm:gap-3">
          <InputOTPSlot index={0} className="w-10 h-12 text-center text-lg sm:w-12 sm:h-14" />
          <InputOTPSlot index={1} className="w-10 h-12 text-center text-lg sm:w-12 sm:h-14" />
          <InputOTPSlot index={2} className="w-10 h-12 text-center text-lg sm:w-12 sm:h-14" />
          <InputOTPSlot index={3} className="w-10 h-12 text-center text-lg sm:w-12 sm:h-14" />
          <InputOTPSlot index={4} className="w-10 h-12 text-center text-lg sm:w-12 sm:h-14" />
          <InputOTPSlot index={5} className="w-10 h-12 text-center text-lg sm:w-12 sm:h-14" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
