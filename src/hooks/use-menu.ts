import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useMenu = (path: string) => {
  const pathname = usePathname()

  const [active, setActive] = useState<boolean>(false)

  useEffect(() => {
    const activeMenu = () => {
      setActive(pathname.includes(path))
    }

    activeMenu()
  }, [path, pathname])

  return active
}
