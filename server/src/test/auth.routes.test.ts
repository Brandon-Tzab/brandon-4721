import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app.js";

describe("POST /api/auth/hash", () => {
    it("debe responder 200 con el hash cuando el password es válido", async () => {
        const response = await request(app).post("/api/auth/hash").send({ password: "12345678" });
        expect(response.status).toBe(200);
        expect(response.body.passwordHash.startsWith("$2")).toBe(true);
    });

    it("debe responder 400 cuando el password es demasiado corto", async () => {
        const response = await request(app).post("/api/auth/hash").send({ password: "1234567" });
        expect(response.status).toBe(400);
    });

    it("debe responder 400 cuando el password excede 72 caracteres", async () => {
        const response = await request(app).post("/api/auth/hash").send({ password: "a".repeat(73) });
        expect(response.status).toBe(400);
    });
});

describe("POST /api/auth/verify", () => {
    let hash: string;

    beforeAll(async () => {
        const response = await request(app).post("/api/auth/hash").send({ password: "12345678" });
        hash = response.body.passwordHash;
    });

    it("debe responder match true cuando el password coincide con su hash", async () => {
        const response = await request(app).post("/api/auth/verify").send({ password: "12345678", passwordHash: hash });
        expect(response.status).toBe(200);
        expect(response.body.match).toBe(true);
    });

    it("debe responder 200 con match false cuando el password no coincide", async () => {
        const response = await request(app).post("/api/auth/verify").send({ password: "wrongpassword", passwordHash: hash });
        expect(response.status).toBe(200);
        expect(response.body.match).toBe(false);
    });

    it("debe responder 200 con match false cuando el hash tiene formato inválido", async () => {
        const response = await request(app).post("/api/auth/verify").send({ password: "wrongpassword", passwordHash: "wrongHash" });
        expect(response.status).toBe(200);
        expect(response.body.match).toBe(false);
    });
});

describe("manejo de errores globales", () => {
    it("debe responder 400 con un error controlado cuando el JSON del body está mal formado", async () => {
        const response = await request(app)
            .post("/api/auth/hash")
            .set("Content-Type", "application/json")
            .send('{"password": '); // JSON incompleto a propósito

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Solicitud inválida");
    });
});