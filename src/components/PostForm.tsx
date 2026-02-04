'use client';

import { createPost, updatePost, getAllPostsForSelect } from '@/app/actions';
import { useState, useEffect, useMemo, useCallback, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Post } from '@prisma/client';
import SearchableSelect from './SearchableSelect';
import SubmitButton from './SubmitButton';

// Helper to get initial nav config value
const getInitialNavValue = (config?: string, postId?: string | null) => {
    if (config === 'home') return 'home';
    if (config === 'none') return 'none';
    if (config === 'custom' && postId) return postId;
    return '';
};

export default function PostForm({ post }: { post?: Post }) {
    const [slug, setSlug] = useState(post?.slug || '');
    const [content, setContent] = useState(post?.content || '');
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [availablePosts, setAvailablePosts] = useState<{ id: string; title: string }[]>([]);
    const [prevPostValue, setPrevPostValue] = useState(getInitialNavValue(post?.prevNavConfig, post?.prevPostId));
    const [nextPostValue, setNextPostValue] = useState(getInitialNavValue(post?.nextNavConfig, post?.nextPostId));
    const router = useRouter();

    // Load initial posts (limited)
    useEffect(() => {
        getAllPostsForSelect(undefined, 20).then((posts) => {
            setAvailablePosts(posts.filter((p) => p.id !== post?.id));
        });
    }, [post?.id]);

    // Memoize nav options to avoid recreating on every render
    const navOptions = useMemo(
        () => [
            { value: '', label: '-- Default (Chronological) --' },
            { value: 'home', label: 'Home Page' },
            { value: 'none', label: 'None (Hidden)' },
            ...availablePosts.map((p) => ({
                value: p.id,
                label: p.title,
                group: 'posts',
            })),
        ],
        [availablePosts]
    );

    // Handle async search with useCallback to prevent recreation
    const handlePostSearch = useCallback(
        async (searchTerm: string) => {
            const posts = await getAllPostsForSelect(searchTerm);
            return posts
                .filter((p) => p.id !== post?.id)
                .map((p) => ({
                    value: p.id,
                    label: p.title,
                    group: 'posts',
                }));
        },
        [post?.id]
    );

    const generateSlug = useCallback(
        (title: string) => {
            if (!post) {
                setSlug(
                    title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '')
                );
            }
        },
        [post]
    );

    const handleAction = async (_prevState: unknown, formData: FormData) => {
        try {
            const result = post ? await updatePost(null, formData) : await createPost(null, formData);

            if (result?.success) {
                toast.success(result.message);
                router.push('/admin');
                return { success: true };
            } else {
                toast.error(result?.message || 'Something went wrong');
                return { success: false };
            }
        } catch (_error) {
            toast.error('An unexpected error occurred');
            return { success: false };
        }
    };

    const [, formAction] = useActionState(handleAction, null);

    const insertText = (before: string, after: string = '') => {
        const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <form action={formAction} className="post-form">
            {post && <input type="hidden" name="id" value={post.id} />}

            {/* Top row: Title, Slug, Excerpt, Tags, Published */}
            <div className="top-section">
                <div className="top-row">
                    <div className="input-group">
                        <label className="label">Title</label>
                        <input
                            name="title"
                            defaultValue={post?.title}
                            onChange={(e) => generateSlug(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Slug</label>
                        <input
                            name="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="label">Excerpt</label>
                    <textarea
                        name="excerpt"
                        defaultValue={post?.excerpt}
                        required
                        className="textarea excerpt-textarea"
                    />
                </div>

                <div className="input-group">
                    <label className="label">Tags (comma separated)</label>
                    <input name="tags" defaultValue={post?.tags} className="input" />
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label className="label">Previous Post (Optional custom link)</label>
                        <SearchableSelect
                            name="prevPostId"
                            value={prevPostValue}
                            onChange={setPrevPostValue}
                            options={navOptions}
                            placeholder="Select previous post"
                            onSearch={handlePostSearch}
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Next Post (Optional custom link)</label>
                        <SearchableSelect
                            name="nextPostId"
                            value={nextPostValue}
                            onChange={setNextPostValue}
                            options={navOptions}
                            placeholder="Select next post"
                            onSearch={handlePostSearch}
                        />
                    </div>
                </div>

                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        name="published"
                        id="published"
                        defaultChecked={post?.published}
                        className="checkbox"
                    />
                    <label htmlFor="published" className="checkbox-label">
                        Published
                    </label>
                </div>
            </div>

            {/* Mobile-only toggle button - positioned above containers */}
            <button
                type="button"
                className="mobile-toggle-button"
                onClick={() => setActiveTab(activeTab === 'write' ? 'preview' : 'write')}
                title={activeTab === 'write' ? 'Switch to Preview' : 'Switch to Write'}
            >
                {activeTab === 'write' ? (
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                ) : (
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                )}
            </button>

            {/* Responsive: 2 columns on desktop, 1 column on mobile */}
            <div className="editor-preview-wrapper">
                {/* Editor container */}
                <div className={`editor-container ${activeTab === 'write' ? 'mobile-active' : ''}`}>
                    <div className="editor-header">
                        <div className="header-title">Editor</div>
                        <div className="toolbar">
                            <button
                                type="button"
                                onClick={() => insertText('**', '**')}
                                title="Bold"
                                className="toolbar-btn"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onClick={() => insertText('*', '*')}
                                title="Italic"
                                className="toolbar-btn"
                            >
                                I
                            </button>
                            <button
                                type="button"
                                onClick={() => insertText('`', '`')}
                                title="Code"
                                className="toolbar-btn"
                            >
                                {'<>'}
                            </button>
                            <button
                                type="button"
                                onClick={() => insertText('[', '](url)')}
                                title="Link"
                                className="toolbar-btn"
                            >
                                Link
                            </button>
                        </div>
                    </div>
                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Write your markdown here..."
                        className="editor-textarea"
                    />
                </div>

                {/* Preview container */}
                <div className={`preview-container ${activeTab === 'preview' ? 'mobile-active' : ''}`}>
                    <div className="preview-header">
                        <div className="header-title">Live Preview</div>
                    </div>
                    <div className="markdown-preview post-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            <SubmitButton
                label={post ? 'Update Post' : 'Create Post'}
                loadingLabel={post ? 'Updating...' : 'Creating...'}
            />
        </form>
    );
}
