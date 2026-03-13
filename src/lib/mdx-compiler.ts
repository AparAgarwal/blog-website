import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to wrap <table> elements in a scrollable container div.
 */
function rehypeWrapTables() {
    return (tree: Root) => {
        visit(tree, 'element', (node: Element, index, parent) => {
            if (node.tagName === 'table' && parent && typeof index === 'number') {
                const wrapper: Element = {
                    type: 'element',
                    tagName: 'div',
                    properties: { className: ['table-wrapper'] },
                    children: [node],
                };
                (parent as Element).children[index] = wrapper;
            }
        });
    };
}

/**
 * Pre-compiles markdown/MDX content to HTML using the same remark/rehype
 * pipeline as the MDXRemote component, but produces a static HTML string
 * that can be stored in the database and served without re-compilation.
 *
 * This eliminates the expensive Shiki syntax highlighting step from the
 * read path — it only runs once at write-time.
 */
export async function compileMarkdownToHtml(source: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypePrettyCode, {
            theme: {
                dark: 'dark-plus',
                light: 'light-plus',
            },
            keepBackground: false,
        })
        .use(rehypeWrapTables)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(source);

    return String(result);
}
