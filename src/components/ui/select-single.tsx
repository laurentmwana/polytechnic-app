'use client'

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Option {
  value: string
  label: string
  group?: string
}

interface SingleSelectProps {
  options: Option[]
  placeholder?: string
  onChange: (selectedOption: string) => void
  value?: string
  className?: string
  disabled?: boolean
  itemsPerPage?: number
}

export const SelectSingle: React.FC<SingleSelectProps> = ({
  value,
  options,
  placeholder = 'Sélectionne une option...',
  onChange,
  className,
  disabled = false,
  itemsPerPage = 5,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    options.find((option) => option.value === value)
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [currentPage, setCurrentPage] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'grouped'>('list')

  const wrapperRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Update selected option when value prop changes
  useEffect(() => {
    const newSelectedOption = options.find((option) => option.value === value)
    setSelectedOption(newSelectedOption)
  }, [value, options])

  // Group options if they have a group property
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, Option[]> = {}

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filteredOptions.forEach((option) => {
      const group = option.group || 'Autres'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(option)
    })

    return groups
  }, [options, searchTerm])

  // Flat list of filtered options
  const filteredOptions = React.useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage)

  // Get current page items
  const currentItems = React.useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return filteredOptions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredOptions, currentPage, itemsPerPage])

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(0)
    setHighlightedIndex(-1)
  }, [searchTerm])

  // Define selectOption with useCallback
  const selectOption = useCallback(
    (option: Option) => {
      setSelectedOption(option)
      onChange(option.value)
      setIsOpen(false)
      setSearchTerm('')
      setHighlightedIndex(-1)
    },
    [onChange]
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (viewMode === 'list' || viewMode === 'grid') {
            setHighlightedIndex((prevIndex) => {
              const nextIndex =
                prevIndex < currentItems.length - 1 ? prevIndex + 1 : prevIndex
              // If we're at the end of the page, go to next page
              if (
                nextIndex === currentItems.length - 1 &&
                currentPage < totalPages - 1
              ) {
                setCurrentPage((prev) => prev + 1)
                return 0
              }
              return nextIndex
            })
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (viewMode === 'list' || viewMode === 'grid') {
            setHighlightedIndex((prevIndex) => {
              const nextIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex
              // If we're at the start of the page, go to previous page
              if (nextIndex === 0 && prevIndex === 0 && currentPage > 0) {
                setCurrentPage((prev) => prev - 1)
                return itemsPerPage - 1
              }
              return nextIndex
            })
          }
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && highlightedIndex < currentItems.length) {
            selectOption(currentItems[highlightedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSearchTerm('')
          setHighlightedIndex(-1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isOpen,
    highlightedIndex,
    currentItems,
    currentPage,
    totalPages,
    viewMode,
    itemsPerPage,
    selectOption,
  ])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setHighlightedIndex(-1)
      if (!isOpen) {
        setSearchTerm('')
        setCurrentPage(0)
      }
    }
  }

  const removeOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOption(undefined)
    onChange('')
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
      setHighlightedIndex(-1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
      setHighlightedIndex(-1)
    }
  }

  const handleViewModeChange = (mode: 'list' | 'grid' | 'grouped') => {
    setViewMode(mode)
    setHighlightedIndex(-1)
    setCurrentPage(0)
  }

  return (
    <div className={cn('relative w-full', className)} ref={wrapperRef}>
      <div
        className={cn(
          'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'transition-all duration-200 ease-in-out',
          'hover:border-muted-foreground/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          isOpen && 'ring-2 ring-ring ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'cursor-pointer'
        )}
        onClick={toggleDropdown}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleDropdown()
          }
        }}
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
      >
        {!selectedOption ? (
          <div className="text-muted-foreground">{placeholder}</div>
        ) : (
          <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-md px-2 py-1 text-sm font-medium">
            <span className="truncate">{selectedOption.label}</span>
            {!disabled && (
              <X
                size={14}
                className="ml-1 cursor-pointer text-primary/70 hover:text-destructive transition-colors flex-shrink-0"
                onClick={removeOption}
                aria-label="Supprimer la sélection"
              />
            )}
          </div>
        )}
        <ChevronDown
          size={16}
          className={cn(
            'ml-auto text-muted-foreground transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {/* Dropdown menu with animation */}
      <div
        className={cn(
          'absolute z-50 w-full mt-1 bg-popover border border-input rounded-md shadow-lg',
          'transition-all duration-200 ease-in-out origin-top',
          isOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 translate-y-2 pointer-events-none'
        )}
        role="listbox"
        aria-label="Options"
      >
        {isOpen && (
          <div className="p-3">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search
                size={16}
                className="absolute left-2.5 top-2.5 text-muted-foreground"
              />
              <Input
                ref={searchInputRef}
                className="pl-8 pr-2 py-1 h-9 text-sm"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setHighlightedIndex(-1)
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Rechercher dans les options"
              />
            </div>

            {/* View Mode Controls and Pagination */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs',
                    viewMode === 'list' && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handleViewModeChange('list')}
                >
                  Liste
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs',
                    viewMode === 'grid' && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handleViewModeChange('grid')}
                >
                  Grille
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs',
                    viewMode === 'grouped' &&
                      'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handleViewModeChange('grouped')}
                >
                  Groupes
                </Button>
              </div>

              {(viewMode === 'list' || viewMode === 'grid') &&
                filteredOptions.length > itemsPerPage && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      aria-label="Page précédente"
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <span className="text-muted-foreground px-2">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      aria-label="Page suivante"
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                )}
            </div>

            <Separator className="mb-3" />

            {/* Options Display */}
            {filteredOptions.length > 0 ? (
              <>
                {/* List View */}
                {viewMode === 'list' && (
                  <div className="max-h-[200px] overflow-hidden">
                    <ul className="space-y-1" role="listbox">
                      {currentItems.map((option, index) => (
                        <li
                          key={option.value}
                          className={cn(
                            'px-3 py-2 cursor-pointer text-sm rounded-md flex items-center justify-between',
                            'transition-colors duration-150 ease-in-out',
                            highlightedIndex === index
                              ? 'bg-primary/20 text-primary'
                              : selectedOption?.value === option.value
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted/50'
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            selectOption(option)
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          role="option"
                          aria-selected={selectedOption?.value === option.value}
                        >
                          <span className="truncate">{option.label}</span>
                          {selectedOption?.value === option.value && (
                            <Check
                              size={16}
                              className="text-primary flex-shrink-0 ml-2"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="max-h-[200px] overflow-hidden">
                    <div className="grid grid-cols-2 gap-1">
                      {currentItems.map((option, index) => (
                        <div
                          key={option.value}
                          className={cn(
                            'p-2 cursor-pointer text-sm rounded-md flex items-center justify-between',
                            'transition-colors duration-150 ease-in-out',
                            highlightedIndex === index
                              ? 'bg-primary/20 text-primary'
                              : selectedOption?.value === option.value
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted/50'
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            selectOption(option)
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          role="option"
                          aria-selected={selectedOption?.value === option.value}
                        >
                          <span className="truncate text-xs">
                            {option.label}
                          </span>
                          {selectedOption?.value === option.value && (
                            <Check
                              size={14}
                              className="text-primary flex-shrink-0 ml-1"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grouped View */}
                {viewMode === 'grouped' && (
                  <div className="max-h-[200px] overflow-auto">
                    {Object.entries(groupedOptions).map(
                      ([group, groupOptions]) => (
                        <div key={group} className="mb-3 last:mb-0">
                          <div className="font-semibold text-xs uppercase text-primary mb-2 px-2 py-1 bg-primary/5 rounded">
                            {group}
                          </div>
                          <ul
                            className="space-y-1"
                            role="group"
                            aria-label={group}
                          >
                            {groupOptions.map((option) => (
                              <li
                                key={option.value}
                                className={cn(
                                  'px-3 py-2 cursor-pointer text-sm rounded-md flex items-center justify-between',
                                  'transition-colors duration-150 ease-in-out',
                                  selectedOption?.value === option.value
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted/50'
                                )}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  selectOption(option)
                                }}
                                role="option"
                                aria-selected={
                                  selectedOption?.value === option.value
                                }
                              >
                                <span className="truncate">{option.label}</span>
                                {selectedOption?.value === option.value && (
                                  <Check
                                    size={16}
                                    className="text-primary flex-shrink-0 ml-2"
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun résultat trouvé</p>
                <p className="text-xs mt-1">
                  Essayez un autre terme de recherche
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
