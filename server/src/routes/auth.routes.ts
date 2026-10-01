import { Router } from "express";
//importar servicios
import { hashPassword, verifyPassword } from "../services/auth.service.js";
//importar schemas
import { hashPasswordSchema, verifyPasswordSchema } from "../schemas/auth.schema.js";
import * as z from "zod"; 

export const authRouter = Router();


//Verificar la contraseña con el esquema y genera el hash de la contraseña
authRouter.post("/hash", async (req, res) => {
    const parsed = hashPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    try{
        const resultado = await hashPassword(parsed.data.password);
        return res.json({ passwordHash: resultado });
    } catch (error) {
        console.error("Error al hashear la contraseña:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Verifica la contraseña con el esquema y verifica si es válida
authRouter.post("/verify", async (req, res) => {
    const parsed = verifyPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
    console.warn("Intento de verify con datos mal formados:", parsed.error.issues);
    return res.json({ match: false });
    }
    try {
        const resultado = await verifyPassword(parsed.data.password, parsed.data.passwordHash);
        return res.json({ match: resultado });
    } catch (error) {
        console.error("Error al verificar la contraseña:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});