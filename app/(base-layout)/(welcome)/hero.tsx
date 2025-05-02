'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Book } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => {
    // Alterner la direction avec (-1)^i
    const direction = position * (i % 2 === 0 ? 1 : -1)

    return {
      id: i,
      d: `M-${100 - i * 5 * direction} -${189 + i * 6}C-${
        380 - i * 5 * direction
      } -${189 + i * 6} -${212 - i * 5 * direction} ${216 - i * 6} ${
        152 - i * 5 * direction
      } ${300 - i * 6}C${616 - i * 5 * direction} ${900 - i * 6} ${
        120 - i * 5 * direction
      } ${875 - i * 6} ${120 - i * 5 * direction} ${875 - i * 6}`,
      color: `rgba(59,130,246,${0.1 + i * 0.02})`,
      width: 0.5 + i * 0.03,
    }
  })

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-primary"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            fill="none"
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.4, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export const WelcomeHero = ({ isLoading = false }) => {
  if (isLoading) {
    return <WelcomeHeroSkeleton />
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          <Book className="mr-2 h-5 w-5" />
          <span>Université de Kinshasa</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl"
        >
          <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-gray-200">
            Faculté de polytechnique
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-slate-700 md:text-xl dark:text-gray-300">
            La Faculté Polytechnique de l&#39;Université de Kinshasa (UNIKIN)
            est un pôle d&#39;excellence en ingénierie et en technologie,
            formant depuis des décennies les leaders de demain dans les domaines
            scientifiques et industriels...
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="rounded-md bg-primary px-8 py-6 text-lg font-medium text-white hover:bg-primary/80">
              En savoir plus
            </Button>

            <Button
              variant="outline"
              className="rounded-md px-8 py-6 text-lg font-medium "
            >
              Voir l&#39;horaire
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SkeletonFloatingPaths() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent opacity-30">
      {/* Simplified representation of the animated paths */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-full h-full border-t border-accent/10 rounded-full transform -rotate-45"></div>
        <div className="absolute top-1/3 left-1/3 w-full h-full border-t border-accent/10 rounded-full transform -rotate-12"></div>
        <div className="absolute top-1/2 right-1/4 w-full h-full border-t border-accent/10 rounded-full transform rotate-45"></div>
      </div>
    </div>
  )
}

export const WelcomeHeroSkeleton = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <SkeletonFloatingPaths />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-6 inline-flex items-center rounded-full bg-accent/20 px-4 py-2">
          <Skeleton className="mr-2 h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="max-w-4xl">
          <Skeleton className="mb-6 h-12 w-full sm:h-14 md:h-16 max-w-2xl" />
          <Skeleton className="mb-4 h-6 w-full max-w-2xl" />
          <Skeleton className="mb-4 h-6 w-5/6 max-w-2xl" />
          <Skeleton className="mb-8 h-6 w-4/6 max-w-2xl" />

          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-14 w-full sm:w-40 rounded-md" />
            <Skeleton className="h-14 w-full sm:w-40 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
