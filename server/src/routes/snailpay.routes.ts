import { Router } from "express";
import { snailpaySchema } from "../schemas/snailpay.schema.js";
import { processCharge } from "../services/snailpay.service.js";
import * as z from "zod"; 

export const snailpayRouter = Router();

snailpayRouter.post("/charge", (req, res) => {
    const parsed = snailpaySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    try{
        const resultado =  processCharge(parsed.data);
        const response = {
            id: crypto.randomUUID(),
            status: resultado.status,
            status_detail: resultado.statusDetail,
            transaction_amount: parsed.data.amount,
            date_created: new Date().toISOString(),
            authorization_code: resultado.authorizationCode,
            reference: crypto.randomUUID(),
            payer_id: parsed.data.payerId,
            payer_email: parsed.data.payerEmail,
            cardNumber: parsed.data.cardNumber,
            cvv: parsed.data.cvv,
        };

        if(resultado.status === "system_error") {
            return res.status(503).json(response);
        }

        return res.json(response);
    } catch (error) {
        console.error("Error al procesar el cargo:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});