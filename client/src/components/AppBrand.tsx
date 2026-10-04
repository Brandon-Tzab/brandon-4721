interface AppBrandProps {
  size?: 'default' | 'lg'
}

export function AppBrand({ size = 'default' }: AppBrandProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={size === 'lg' ? 'text-4xl' : 'text-2xl'}
        aria-hidden="true"
      >
        🐌
      </span>
      <span
        className={
          size === 'lg'
            ? 'text-2xl font-bold'
            : 'text-lg font-semibold'
        }
      >
        Sistema de caracoles
      </span>
    </div>
  )
}
