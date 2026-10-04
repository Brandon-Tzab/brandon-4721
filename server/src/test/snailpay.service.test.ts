import { describe, it, expect } from "vitest";
import { processCharge } from "../services/snailpay.service.js";

describe("snailpayTest", () => {

    const cardSystemError = {
        payerId: "12345",
        payerEmail: "prueba@example.com",
        cardNumber: "0000000000000000",
        expirationDate: "12/26",
        cvv: "543",
        fullName: "John Doe",
        amount: 100
    }

    const cardNumberRejected = {
        payerId: "12345",
        payerEmail: "prueba@example.com",
        cardNumber: "1234123412341235",
        expirationDate: "12/26",
        cvv: "543",
        fullName: "John Doe",
        amount: 100
    }

    const cardDateRejected = {
        payerId: "12345",
        payerEmail: "prueba@example.com",
        cardNumber: "1234123412341234",
        expirationDate: "12/27",
        cvv: "543",
        fullName: "John Doe",
        amount: 100
    }

    const cardCvvRejected = {
        payerId: "12345",
        payerEmail: "prueba@example.com",
        cardNumber: "1234123412341234",
        expirationDate: "12/26",
        cvv: "544",
        fullName: "John Doe",
        amount: 100
    }

    const cardApproved = {
        payerId: "12345",
        payerEmail: "prueba@example.com",
        cardNumber: "1234123412341234",
        expirationDate: "12/26",
        cvv: "543",
        fullName: "John Doe",
        amount: 100
    }


    it("tarjeta cardSystemError debe regresar system error", async () => {
        const result = processCharge(cardSystemError);
        expect(result.status).toBe("system_error");
        expect(result.statusDetail).toBe("Error interno del sistema, intenta de nuevo más tarde");
    });

    it("tarjeta cardNumberRejected debe regresar rejection", async () => {
        const result = processCharge(cardNumberRejected);
        expect(result.status).toBe("rejected");
        expect(result.statusDetail).toBe("Tarjeta rechazada");
    });

    it("tarjeta cardDateRejected debe regresar rejection", async () => {
        const result = processCharge(cardDateRejected);
        expect(result.status).toBe("rejected");
        expect(result.statusDetail).toBe("Fecha de vencimiento incorrecta");
    });

    it("tarjeta cardCvvRejected debe regresar rejection", async () => {
        const result = processCharge(cardCvvRejected);
        expect(result.status).toBe("rejected");
        expect(result.statusDetail).toBe("Código de seguridad incorrecto");
    });
    
    it("tarjeta cardApproved debe regresar approval", async () => {
        const result = processCharge(cardApproved);
        expect(result.status).toBe("approved");
        expect(result.authorizationCode).not.toBeNull();

    });

})