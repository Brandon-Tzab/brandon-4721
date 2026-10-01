import * as z from "zod"; 


export const hashPasswordSchema = z.object({
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }).max(72, { error: "La contraseña no puede exceder los 72 caracteres" })
});

export const verifyPasswordSchema = z.object({
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }).max(72, { error: "La contraseña no puede exceder los 72 caracteres" }),
    passwordHash: z.string().min(1, { error: "El hash de la contraseña debe tener al menos 1 carácter" }).regex(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/, { error: "El hash de la contraseña es inválido" })
});