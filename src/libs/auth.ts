import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import credentials from "next-auth/providers/credentials";
import type {NextAuthOptions} from "next-auth";
import dbConnect from "@/libs/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({
                    email: credentials?.email,
                }).select("+password");

                if (!user) throw new Error("Wrong Email");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Wrong Password");

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: async ({session, token}) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                },
            };
        },
    },
};
