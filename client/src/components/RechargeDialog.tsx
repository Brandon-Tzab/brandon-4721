import { useState, type SubmitEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { chargeSnailPay } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

export function RechargeDialog() {
  const { user, addToBalance } = useAuth()

  const [open, setOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [fullName, setFullName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setCardNumber('')
    setExpirationDate('')
    setCvv('')
    setFullName('')
    setAmount('')
    setError(null)
    setSuccessMessage(null)
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    setError(null)

    if (!user) return

    setIsSubmitting(true)
    try {
      const result = await chargeSnailPay({
        payerId: user.id,
        payerEmail: user.email,
        cardNumber,
        expirationDate,
        cvv,
        fullName,
        amount: Number(amount),
      })

      if (result.status === 'approved') {
        addToBalance(result.transaction_amount)
        setSuccessMessage(
          `Recarga aprobada. Se agregaron $${result.transaction_amount.toFixed(2)} a tu saldo.`
        )
      } else {
        setError(result.status_detail)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocurrió un error inesperado'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DialogTrigger render={<Button>Cargar saldo</Button>} />
      <DialogContent>
        {successMessage ? (
          <>
            <DialogHeader>
              <DialogTitle>Recarga aprobada</DialogTitle>
              <DialogDescription>{successMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Cargar saldo con SnailPay</DialogTitle>
              <DialogDescription>
                Ingresa los datos de tu tarjeta para recargar tu saldo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cardNumber">Número de tarjeta</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={16}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="expirationDate">Vencimiento (MM/AA)</Label>
                  <Input
                    id="expirationDate"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="12/26"
                    maxLength={5}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Nombre en la tarjeta</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Monto a cargar</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Procesando...' : 'Confirmar recarga'}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
