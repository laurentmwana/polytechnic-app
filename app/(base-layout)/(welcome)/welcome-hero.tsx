'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

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
        684 - i * 5 * direction
      } ${875 - i * 6} ${200 - i * 5 * direction} ${875 - i * 6}`,
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
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export const WelcomeHero = () => {
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
          className="mb-6 inline-flex items-center rounded-full bg-primary/30 px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Université de Kinshasa
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
              Découvrir l&#39;application
            </Button>

            <Button
              variant="outline"
              className="rounded-md border-slate-200 bg-white px-8 py-6 text-lg font-medium text-slate-800 hover:bg-slate-50"
            >
              En savoir plus
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
