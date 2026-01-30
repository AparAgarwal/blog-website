
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
    return (
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: '900px' }}>
            <h1 style={{ marginBottom: '40px' }}>Create New Post</h1>
            <PostForm />
        </div>
    )
}
