import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Utils } from '../utils/utils'
import 'highlight.js/styles/github-dark.css'

const MarkdownContent = ({ text, className = '' }) => {
  if (!text) return null

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义代码块组件
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            // 检查是否是行内代码：没有换行符且没有语言类名
            const isInlineCode = inline === true || (
              inline === undefined && 
              !className && 
              typeof children === 'string' && 
              !children.includes('\n')
            )
            
            // 行内代码 - 直接返回inline code元素，不包装在任何div中
            if (isInlineCode) {
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              )
            }
            
            // 代码块 - 返回完整的代码块结构
            return (
              <div className="code-block-wrapper">
                {language && (
                  <div className="code-block-header">
                    <span className="code-language">{language}</span>
                    <button 
                      className="code-copy-btn"
                      onClick={(e) => {
                        const codeText = String(children).replace(/\n$/, '')
                        Utils.copyToClipboard(codeText, e.target)
                      }}
                      title="Copy code"
                    >
                      📋
                    </button>
                  </div>
                )}
                <pre className={className}>
                  <code {...props}>{children}</code>
                </pre>
              </div>
            )
          },
          // 修复p标签嵌套div的警告
          p: ({ children, ...props }) => {
            // 检查是否包含代码块等块级元素
            const hasBlockElements = React.Children.toArray(children).some(child => 
              React.isValidElement(child) && 
              (child.type === 'div' || 
               (child.props && child.props.className && 
                (child.props.className.includes('code-block-wrapper') || 
                 child.props.className.includes('tool-call'))))
            )
            
            // 如果包含块级元素，使用div而不是p
            if (hasBlockElements) {
              return <div {...props}>{children}</div>
            }
            
            return <p {...props}>{children}</p>
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent