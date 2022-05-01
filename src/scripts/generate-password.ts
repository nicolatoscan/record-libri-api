import * as bcrypt from 'bcrypt';

async function generatePassword(password: string) {
    const psw = await bcrypt.hash(password, 10);
    console.log(psw);
}

generatePassword('password');