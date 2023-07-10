import bcrypt from 'bcrypt';

// hash the password
export const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        return hashedPassword;
    } catch (err) {
        console.log(err);
    }
}

// to compare the password
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}