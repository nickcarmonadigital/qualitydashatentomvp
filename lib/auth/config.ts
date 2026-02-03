import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Atento Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "demo@atento.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Mock Auth for MVP Development
                if (
                    credentials?.email === "demo@atento.com" &&
                    credentials?.password === "password123"
                ) {
                    return {
                        id: "u-123",
                        name: "Demo Manager",
                        email: "demo@atento.com",
                        role: "manager", // Custom role property
                        image: "https://i.pravatar.cc/150?u=u-123"
                    };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 Hours (Security Requirement)
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        }
    }
};
