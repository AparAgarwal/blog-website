
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getRateLimitInfo } from '@/lib/rate-limit';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Rate limiting: 5 attempts per 10 minutes with exponential backoff
                const allowed = await checkRateLimit(credentials.email, 5, 600);
                if (!allowed) {
                    const remainingTime = await getRateLimitInfo(credentials.email);
                    const minutes = remainingTime ? Math.ceil(remainingTime / 60) : 10;
                    throw new Error(`Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`);
                }

                const user = await prisma.admin.findUnique({
                    where: { email: credentials.email }
                });

                // Timing attack prevention: always compare password
                const hashedPassword = user?.password || '$2a$10$abcdefghijklmnopqrstuvwxyzABCDE'; // Dummy hash
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    hashedPassword
                );

                if (!user || !isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: 'Admin',
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                session.user.email = token.email as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
