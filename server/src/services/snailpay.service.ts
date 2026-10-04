import { snailpaySchema } from "../schemas/snailpay.schema.js"
import * as z from "zod"

type ChargeInput = z.infer<typeof snailpaySchema>

export interface ChargeResult {
    status: "approved" | "rejected" | "system_error"
    statusDetail: string
    authorizationCode: string | null
}

function generateAuthorizationCode(): string {
    return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function processCharge(data: ChargeInput): ChargeResult {

    if (data.cardNumber === "0000000000000000") {
        return {
            status: "system_error",
            statusDetail: "Error interno del sistema, intenta de nuevo más tarde",
            authorizationCode: null
        };
    }

    if (data.cardNumber !== "1234123412341234") {
        return {
            status: "rejected",
            statusDetail: "Tarjeta rechazada",
            authorizationCode: null
        };
    }

    if (data.expirationDate !== "12/26") {
        return {
            status: "rejected",
            statusDetail: "Fecha de vencimiento incorrecta",
            authorizationCode: null
        };
    }

    if (data.cvv !== "543") {
        return {
            status: "rejected",
            statusDetail: "Código de seguridad incorrecto",
            authorizationCode: null
        };
    }

    return {
        status: "approved",
        statusDetail: "Cargo procesado exitosamente",
        authorizationCode: generateAuthorizationCode()
    };
} 