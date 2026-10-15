'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code2,
  Undo,
  Redo,
  FileCode,
  Eye,
} from 'lucide-react';

const HTML_STRIP_REGEX = /<[^>]*>/g;
const WHITESPACE_SPLIT_REGEX = /\s+/;

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  badge?: string;
  badgeColor?: 'slate' | 'emerald';
  minHeight?: string;
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = 'Write rich product description here...',
  label,
  badge,
  badgeColor = 'slate',
  minHeight = '180px',
}: TipTapEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none p-3.5 text-slate-800 text-xs leading-relaxed`,
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const cleanHtml = html === '<p></p>' ? '' : html;
      setHtmlSource(cleanHtml);
      onChange(cleanHtml);
    },
  });

  // Sync external value updates
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isHtmlMode) {
      editor.commands.setContent(value || '');
      setHtmlSource(value || '');
    }
  }, [value, editor, isHtmlMode]);

  const handleHtmlSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlSource(val);
    onChange(val);
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      if (editor) {
        editor.commands.setContent(htmlSource);
      }
      setIsHtmlMode(false);
    } else {
      if (editor) {
        setHtmlSource(editor.getHTML());
      }
      setIsHtmlMode(true);
    }
  };

  // Word and character stats wrapped in useMemo to prevent regex and string re-allocation on every render
  const { wordCount, charCount } = useMemo(() => {
    const text = (htmlSource || '').replace(HTML_STRIP_REGEX, '').trim();
    return {
      wordCount: text ? text.split(WHITESPACE_SPLIT_REGEX).length : 0,
      charCount: text.length,
    };
  }, [htmlSource]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs focus-within:border-[#c08a46] transition-colors">
      {/* Optional Top Label & Language Badge Header */}
      {label && (
        <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">{label}</span>
          {badge && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                badgeColor === 'emerald'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="p-1.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-1 flex-wrap text-xs">
        <div className="flex items-center gap-0.5 flex-wrap">
          {/* History */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo() || isHtmlMode}
            className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-40 transition-colors"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo() || isHtmlMode}
            className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-40 transition-colors"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1" />

          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('bold')
                ? 'bg-[#c08a46] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('italic')
                ? 'bg-[#c08a46] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('underline')
                ? 'bg-[#c08a46] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('strike')
                ? 'bg-[#c08a46] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('code')
                ? 'bg-[#c08a46] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().setParagraph().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('paragraph') && !editor?.isActive('heading')
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Paragraph"
          >
            <Pilcrow className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('heading', { level: 1 })
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('heading', { level: 2 })
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('heading', { level: 3 })
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1" />

          {/* Lists & Blocks */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('bulletList')
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('orderedList')
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('blockquote')
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            disabled={isHtmlMode}
            className="p-1.5 rounded text-slate-600 hover:bg-white transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            disabled={isHtmlMode}
            className={`p-1.5 rounded transition-colors ${
              editor?.isActive('codeBlock')
                ? 'bg-[#c08a46] text-white'
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Code Block"
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* HTML Source Toggle Button */}
        <button
          type="button"
          onClick={toggleHtmlMode}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
            isHtmlMode
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
          title="Toggle HTML Source Code View"
        >
          {isHtmlMode ? (
            <>
              <Eye className="w-3 h-3 text-amber-700" />
              <span>WYSIWYG</span>
            </>
          ) : (
            <>
              <FileCode className="w-3 h-3 text-[#c08a46]" />
              <span>&lt;/&gt; HTML</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          value={htmlSource}
          onChange={handleHtmlSourceChange}
          placeholder="Enter raw HTML markup here..."
          className="w-full p-3.5 text-xs font-mono bg-slate-900 text-amber-100 focus:outline-none resize-y"
          style={{ minHeight }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      {/* Footer Word & Character Counter */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>{isHtmlMode ? 'HTML Source Mode' : 'TipTap Visual Editor'}</span>
        <span>
          {wordCount} words &bull; {charCount} chars
        </span>
      </div>
    </div>
  );
}
