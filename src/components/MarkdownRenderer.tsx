import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Pre-process any escaped or malformed markdown strings (e.g. literal \n, redundant asterisks)
  const normalizedContent = (content || '')
    .replace(/\\n/g, '\n')
    .trim();

  return (
    <div className={`prose-heritage text-stone-800 leading-relaxed space-y-3.5 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold font-heritage text-stone-950 mt-4 mb-2 pb-1.5 border-b border-amber-900/15 flex items-center gap-2">
              <span className="text-amber-700 font-normal">§</span>
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold font-heritage text-amber-950 mt-3.5 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-amber-600 rounded-full inline-block mr-1"></span>
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-3 mb-1.5 text-amber-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-bold text-stone-800 mt-2 mb-1 uppercase tracking-wider text-amber-800">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal my-1.5">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-stone-950 text-amber-950 bg-amber-500/10 px-1 py-0.5 rounded">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-stone-700">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-4 sm:pl-5 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 pl-4 sm:pl-5 list-decimal text-amber-900 font-semibold text-xs sm:text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs sm:text-sm text-stone-800 leading-relaxed flex items-start gap-2 font-normal">
              <span className="text-amber-600 font-bold text-base leading-none select-none mt-0.5">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-600 bg-amber-50/60 p-3.5 rounded-r-xl my-2.5 text-stone-800 italic text-xs sm:text-sm font-serif">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-stone-100 text-amber-900 font-mono text-xs px-1.5 py-0.5 rounded border border-stone-200">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-stone-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-100 text-stone-900 font-bold uppercase text-[11px] border-b border-stone-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-stone-100 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-stone-50/80 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 text-stone-900 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-stone-700">
              {children}
            </td>
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
