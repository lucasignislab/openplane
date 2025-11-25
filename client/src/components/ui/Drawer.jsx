import { useEffect } from 'react';
import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, children, title }) => {
    // Fechar ao pressionar ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop (clique fora para fechar) */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
                onClick={onClose}
            />

            {/* Painel Deslizante */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col animate-in slide-in-from-right">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                    <h2 className="text-sm font-mono text-slate-500 font-medium">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Conteúdo com Scroll */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;
