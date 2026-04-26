import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ success: true, data: user, token: token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updatePassword = async (req, res) => {
    const { email, password, newPassword } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.users.update({
            where: { email },
            data: { password: hashedPassword },
        });
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}