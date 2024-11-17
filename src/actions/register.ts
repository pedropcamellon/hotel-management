"use server";

import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/libs/dbConnect";

export const register = async (values: any) => {
    const { email, password, name } = values;

    try {
        await dbConnect();

        const userFound = await User.findOne({ email });

        if (userFound) {
            return {
                error: 'Email already exists!'
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();
    } catch (e) {
        console.error(`(actions/register) ${e}`);
    }
}