import Image from 'next/image'

type AppLogoIconProps = { className?: string; height?: number; width?: number }

export const AppLogoIcon = ({
  className = '',
  width = 40,
  height = 40,
}: AppLogoIconProps) => {
  return (
    <Image
      width={width}
      height={height}
      className={className}
      src="/logo.svg"
      alt="logo du site"
    />
  )
}
