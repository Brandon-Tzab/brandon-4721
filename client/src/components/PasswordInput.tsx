import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from 'cn'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-9', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-0.5 right-0.5"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </Button>
    </div>
  )
}
