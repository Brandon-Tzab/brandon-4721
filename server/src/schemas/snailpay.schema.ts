import * as z from "zod"; 

export const snailpaySchema = z.object({
    payerId: z.string().min(1, { error: "El ID del pagador debe tener al menos 1 carácter" }).max(100, { error: "El ID del pagador no puede exceder los 100 caracteres" }),
    payerEmail: z.string().max(100, { error: "El correo electrónico del pagador no puede exceder los 100 caracteres" }).email({ error: "El correo electrónico del pagador es inválido" }),
    cardNumber: z.string().regex(/^\d{16}$/, { error: "El número de tarjeta es inválido" }),
    expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { error: "La fecha de expiración es inválida" }),
    cvv: z.string().regex(/^\d{3}$/, { error: "El CVV es inválido" }),
    fullName: z.string().min(1, { error: "El nombre completo es requerido" }).max(100, { error: "El nombre completo no puede exceder los 100 caracteres" }),
    amount: z.number().min(0.01, { error: "El monto debe ser mayor a 0" }).max(50000, { error: "El monto no puede exceder 50,000" })
})