import { useEffect } from 'react';
import useUIStore from '../context/useUIStore';

/**
 * Hook que adiciona listeners de teclado globais para atalhos
 */
const useKeyboardShortcuts = () => {
    const { openIssueModal } = useUIStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignorar se estiver em input/textarea
            const target = e.target;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            // Atalho 'C' para criar issue
            if (e.key === 'c' || e.key === 'C') {
                e.preventDefault();
                openIssueModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openIssueModal]);
};

export default useKeyboardShortcuts;
