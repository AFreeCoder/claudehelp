import { getPostData, getAllPostIds } from '@/lib/posts'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

export const runtime = 'edge'

export async function generateMetadata({ params }) {
  const post = await getPostData(params.slug)
  return {
    title: post.title,
    description: post.description,
  }
}

export async function generateStaticParams() {
  const posts = await getAllPostIds()
  return posts
}

export default async function Post({ params }) {
  const post = await getPostData(params.slug)
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, {
      sanitize: false
    })
    .process(post.content)
  const contentHtml = processedContent.toString()

  return (
    <div className="container mx-auto py-12">
      <article className="prose lg:prose-xl mx-auto">
        <h1>{post.title}</h1>
        <div 
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />
      </article>
    </div>
  )
}