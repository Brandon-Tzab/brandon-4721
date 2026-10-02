import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyPassword } from "../services/auth.service.js";

describe("hashTest", () => {

    let hash: string;

    beforeAll(async () => {
        hash = await hashPassword("password");
    });

    it("no debe devolver el password en texto plano", () => {
        expect(hash).not.toBe("password");
    });

    it("debe generar un hash con el formato de bcrypt", () => {
        expect(hash.startsWith("$2")).toBe(true);
    });

    it("ignora los caracteres después del byte 72 (límite de bcrypt)", async () => {
        const base = "a".repeat(72);
        const hashConLimite = await hashPassword(base + "sufijo1");
        const match = await verifyPassword(base + "sufijo2", hashConLimite);
        expect(match).toBe(true); // coincide aunque el sufijo sea distinto, porque bcrypt ignora todo después del byte 72
    });

    it("debe generar hashes distintos para la misma contraseña", async () => {
        const hash2 = await hashPassword("password");
        expect(hash).not.toBe(hash2);
    });

    it("debe retornar true cuando la contraseña coincide", async () => {
        const isMatch = await verifyPassword("password", hash);
        expect(isMatch).toBe(true);
    });

    it("debe retornar false cuando la contraseña no coincide", async () => {
        const isMatch = await verifyPassword("wrongPassword", hash);
        expect(isMatch).toBe(false);
    });

}) 