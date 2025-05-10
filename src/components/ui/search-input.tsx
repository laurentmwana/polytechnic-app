'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import {
  SearchInputSchema,
  type SearchInputSchemaInfer,
} from '@/definitions/search'

type SearchInputProps = {
  value?: string
  onSearch: (newSearch: string) => void
  onReset: () => void
  processing?: boolean
  lengthData?: number
  placeholder?: string
}

export function SearchInput({
  onSearch,
  processing = false,
  value = '',
  lengthData = 0,
  placeholder = 'Recherche...',
  onReset
}: SearchInputProps) {
  const form = useForm<SearchInputSchemaInfer>({
    resolver: zodResolver(SearchInputSchema),
    defaultValues: {
      search: value,
    },
  })

  const onSearchChange = (values: SearchInputSchemaInfer) => {
    onSearch(values.search || '')
  }

  const resetSearch = () => {
    form.reset({ search: '' })
    onSearch('')
    onReset()
  }

  const hasSearch = !!form.watch('search')

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSearchChange)}
          className="space-y-2"
        >
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={placeholder}
                        {...field}
                        value={field.value || ''}
                        className="pr-8"
                      />
                    </FormControl>
                    {hasSearch && (
                      <button
                        type="button"
                        onClick={resetSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Effacer la recherche"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary" disabled={processing}>
              {processing ? <Loader /> : <SearchIcon size={16} />}
            </Button>
          </div>
        </form>
      </Form>

      {hasSearch && lengthData > 0 && (
        <div className="flex items-center justify-between text-sm gap-3">
          <p className="text-muted-foreground">
            {lengthData}{' '}
            {lengthData > 1 ? 'résultats trouvés' : 'résultat trouvé'}
          </p>
          <Button onClick={() => resetSearch()} variant="link" size="sm">
            Réinitialiser la recherche
          </Button>
        </div>
      )}
    </div>
  )
}
