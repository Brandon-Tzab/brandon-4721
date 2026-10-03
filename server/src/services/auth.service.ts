import bcrypt from "bcrypt";

const saltRounds = 10; // cada +1 duplica el costo (2^n iteraciones); 10 es el estándar actual: ~100ms por hash, lento para fuerza bruta masiva pero imperceptible para el usuario

export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}