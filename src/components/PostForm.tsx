'use client';

import { createPost, updatePost } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '@prisma/client';

export default function PostForm({ post }: { post?: Post }) {
    const [slug, setSlug] = useState(post?.slug || '');
    const [content, setContent] = useState(post?.content || '');
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const router = useRouter();

    const generateSlug = (title: string) => {
        if (!post) {
            setSlug(
                title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
            );
        }
    };

    const handleAction = async (formData: FormData) => {
        // Ensure content state is passed if textarea wasn't updated manually (though it should be)
        let result;
        if (post) {
            result = await updatePost(null, formData);
        } else {
            result = await createPost(null, formData);
        }

        if (result?.success) {
            toast.success(result.message);
            router.push('/admin');
        } else {
            toast.error(result?.message || 'Something went wrong');
        }
    };

    const insertText = (before: string, after: string = '') => {
        const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

        setContent(newText);

        // Update cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <form
            action={handleAction}
            className="post-form"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
            {post && <input type="hidden" name="id" value={post.id} />}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Title</label>
                    <input
                        name="title"
                        defaultValue={post?.title}
                        onChange={(e) => generateSlug(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '16px',
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Slug</label>
                    <input
                        name="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '16px',
                        }}
                    />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Excerpt</label>
                <textarea
                    name="excerpt"
                    defaultValue={post?.excerpt}
                    required
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                    }}
                />
            </div>

            <div
                className="editor-container"
                style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}
            >
                <div
                    className="editor-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--bg-secondary)',
                        borderBottom: '1px solid var(--border-color)',
                    }}
                >
                    <div className="tabs" style={{ display: 'flex', gap: '16px' }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab('write')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'write' ? 600 : 400,
                                color: activeTab === 'write' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            }}
                        >
                            Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'preview' ? 600 : 400,
                                color: activeTab === 'preview' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            }}
                        >
                            Preview
                        </button>
                    </div>
                    {activeTab === 'write' && (
                        <div className="toolbar" style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={() => insertText('**', '**')}
                                title="Bold"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onClick={() => insertText('*', '*')}
                                title="Italic"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                I
                            </button>
                            <button
                                type="button"
                                onClick={() => insertText('`', '`')}
                                title="Code"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                {'<>'}
                            </button>
                            <button
                                type="button"
                                onClick={() => insertText('[', '](url)')}
                                title="Link"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                Link
                            </button>
                        </div>
                    )}
                </div>

                <div className="editor-content" style={{ minHeight: '400px', position: 'relative' }}>
                    {activeTab === 'write' ? (
                        <textarea
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="Write your markdown here..."
                            style={{
                                width: '100%',
                                height: '400px',
                                padding: '16px',
                                border: 'none',
                                resize: 'vertical',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontFamily: 'monospace',
                                fontSize: '15px',
                                outline: 'none',
                            }}
                        />
                    ) : (
                        <div
                            className="markdown-preview post-content"
                            style={{
                                padding: '24px',
                                height: '400px',
                                overflowY: 'auto',
                                background: 'var(--bg-primary)',
                            }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tags (comma separated)</label>
                <input
                    name="tags"
                    defaultValue={post?.tags}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="checkbox"
                    name="published"
                    id="published"
                    defaultChecked={post?.published}
                    style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="published" style={{ fontWeight: 500 }}>
                    Published
                </label>
            </div>

            <button type="submit" className="view-all-btn" style={{ alignSelf: 'flex-start', cursor: 'pointer' }}>
                {post ? 'Update Post' : 'Create Post'}
            </button>
        </form>
    );
}
