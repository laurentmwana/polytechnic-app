import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash } from 'lucide-react'
import React from 'react'

type ConfirmationActionProps = {
  title?: string
  description?: string
  onInput: (v: string) => void
}

export const ConfirmationAction = ({
  onInput,
  description = '',
  title = '',
}: ConfirmationActionProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="name" className="text-right">
              Mot de passe
            </Label>
            <Input
              type="password"
              onChange={(e) => onInput(e.target.value)}
              id="name"
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
