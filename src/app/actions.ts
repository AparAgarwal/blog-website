'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth.config'
import { z, ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').min(1, 'Slug is required').max(100, 'Slug is too long'),
    excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt is too long'),
    content: z.string().min(1, 'Content is required').max(50000, 'Content is too long'),
    tags: z.string().max(200, 'Tags string is too long'),
    published: z.boolean()
})

export async function authenticate(_prevState: string | undefined, _formData: FormData) {
    return "Not implemented via server action, use client signIn"
}

// Helper to check auth
async function checkAuth() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }
    return session
}


export interface FormState {
    message?: string;
    success?: boolean;
}


export async function createPost(prevState: FormState | null, formData: FormData) {
    try {
        await checkAuth()

        const rawData = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            excerpt: formData.get('excerpt') as string,
            content: formData.get('content') as string,
            tags: formData.get('tags') as string,
            published: formData.get('published') === 'on' || formData.get('published') === 'true'
        }

        const validatedData = PostSchema.parse(rawData)

        await prisma.post.create({
            data: validatedData,
        })

        revalidatePath('/admin')
        revalidatePath('/')
        revalidatePath('/archive')
        return { success: true, message: 'Post created successfully' }
    } catch (error) {
        if (error instanceof ZodError) {
            return { success: false, message: error.issues[0]?.message }
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { success: false, message: 'A post with this slug already exists' }
            }
        }
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, message: 'Unauthorized. Please login again.' }
        }
        return { success: false, message: 'Failed to create post' }
    }
}

export async function updatePost(prevState: FormState | null, formData: FormData) {
    const id = formData.get('id') as string

    try {
        await checkAuth()

        const rawData = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            excerpt: formData.get('excerpt') as string,
            content: formData.get('content') as string,
            tags: formData.get('tags') as string,
            published: formData.get('published') === 'on' || formData.get('published') === 'true'
        }

        const validatedData = PostSchema.parse(rawData)

        await prisma.post.update({
            where: { id },
            data: validatedData,
        })

        revalidatePath('/admin')
        revalidatePath('/')
        revalidatePath('/archive')
        revalidatePath(`/posts/${validatedData.slug}`)
        return { success: true, message: 'Post updated successfully' }
    } catch (error) {
        if (error instanceof ZodError) {
            return { success: false, message: error.issues[0]?.message }
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { success: false, message: 'A post with this slug already exists' }
            }
        }
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, message: 'Unauthorized. Please login again.' }
        }
        return { success: false, message: 'Failed to update post' }
    }
}

// Direct server action call for delete
export async function deletePost(id: string) {
    try {
        await checkAuth()
        await prisma.post.delete({ where: { id } })
        revalidatePath('/admin')
        revalidatePath('/')
        revalidatePath('/archive')
        return { success: true, message: 'Post deleted successfully' }
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, message: 'Unauthorized. Please login again.' }
        }
        return { success: false, message: 'Failed to delete post' }
    }
}

// Pagination action
export async function fetchPosts(page: number, limit: number) {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: (page - 1) * limit,
        });
        return posts;
    } catch (error) {
        return [];
    }
}

// Change password action
export async function changePassword(prevState: FormState | null, formData: FormData) {
    try {
        const session = await checkAuth()
        
        const currentPassword = formData.get('currentPassword') as string
        const newPassword = formData.get('newPassword') as string

        if (!currentPassword || !newPassword) {
            return { success: false, message: 'All fields are required' }
        }

        // Validate new password strength
        if (newPassword.length < 12) {
            return { success: false, message: 'New password must be at least 12 characters long' }
        }

        if (currentPassword === newPassword) {
            return { success: false, message: 'New password must be different from current password' }
        }

        // Get admin user
        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email! }
        })

        if (!admin) {
            return { success: false, message: 'User not found' }
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, admin.password)
        if (!isValid) {
            return { success: false, message: 'Current password is incorrect' }
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword }
        })

        return { success: true, message: 'Password changed successfully. Please login again.' }
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, message: 'Unauthorized. Please login again.' }
        }
        return { success: false, message: 'Failed to change password' }
    }
}
