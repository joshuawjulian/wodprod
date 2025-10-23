import * as argon2 from "argon2";


export async function hashPassword(password:string) : Promise<string> {
  return await argon2.hash(password);
}

export async function verifyPassword(hash:string, password:string): Promise<boolean> {
  try {
    if (await argon2.verify(hash, password)) return true;
  } catch (err) {
    // internal failure
    console.error(err);
  }
  return false;
}