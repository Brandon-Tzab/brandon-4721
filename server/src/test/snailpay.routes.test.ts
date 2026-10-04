import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("POST /api/snailpay/charge", () => {

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

    it("debe responder 503 cuando se usa cardSystemError", async () => {
        const response = await request(app).post("/api/snailpay/charge").send(cardSystemError);
        expect(response.status).toBe(503);
        expect(response.body.status).toBe("system_error")
    });

    it("debe responder 200 cuando se usa cardNumberRejected", async () => {
        const response = await request(app).post("/api/snailpay/charge").send(cardNumberRejected);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("rejected")
    });

    it("debe responder 200 cuando se usa cardDateRejected", async () => {
        const response = await request(app).post("/api/snailpay/charge").send(cardDateRejected);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("rejected")
    });

    it("debe responder 200 cuando se usa cardCvvRejected", async () => {
        const response = await request(app).post("/api/snailpay/charge").send(cardCvvRejected);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("rejected")
    });

    it("debe responder 200 cuando se usa cardApproved", async () => {
        const response = await request(app).post("/api/snailpay/charge").send(cardApproved);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("approved")
    });

    it("debe responder 400 cuando los datos no tienen el formato correcto", async () => {
        const response = await request(app)
            .post("/api/snailpay/charge")
            .send({ ...cardApproved, cardNumber: "123" });
        expect(response.status).toBe(400);
    });

    it("debe responder 400 cuando el monto no es válido", async () => {
        const response = await request(app)
            .post("/api/snailpay/charge")
            .send({ ...cardApproved, amount: 0 });
        expect(response.status).toBe(400);
    });

});