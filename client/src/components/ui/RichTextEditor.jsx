import { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleInput = () => {
        const html = editorRef.current?.innerHTML || '';
        onChange(html);
    };

    return (
        <div className={`border rounded-lg transition-all ${isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 hover:text-slate-900 transition-all"
                    title="Negrito (Cmd+B)"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 hover:text-slate-900 transition-all"
                    title="Itálico (Cmd+I)"
                >
                    <Italic size={16} />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 hover:text-slate-900 transition-all"
                    title="Lista com marcadores"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 hover:text-slate-900 transition-all"
                    title="Lista numerada"
                >
                    <ListOrdered size={16} />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Digite a URL:');
                        if (url) execCommand('createLink', url);
                    }}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 hover:text-slate-900 transition-all"
                    title="Inserir link"
                >
                    <LinkIcon size={16} />
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                className="min-h-[120px] max-h-[300px] overflow-y-auto p-3 text-sm text-slate-700 outline-none"
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                dangerouslySetInnerHTML={{ __html: value }}
                data-placeholder={placeholder}
                style={{
                    ...(value === '' && {
                        position: 'relative',
                    }),
                }}
            />

            <style>{`
        [contentEditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #cbd5e1;
          pointer-events: none;
        }
        
        [contentEditable="true"] {
          -webkit-user-modify: read-write-plaintext-only;
        }
        
        [contentEditable="true"]:focus {
          outline: none;
        }
        
        [contentEditable="true"] ul,
        [contentEditable="true"] ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        
        [contentEditable="true"] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
