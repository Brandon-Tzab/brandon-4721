import bcrypt from "bcrypt"; //libreria para hashear contraseñas

const saltRounds = 10;

//metodo para hashear la contraseña
export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

//metodo para verificar la contraseña
export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}

