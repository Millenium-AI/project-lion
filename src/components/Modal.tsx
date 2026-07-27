import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open, onClose, children, title, size = 'md',
}: {
  open: boolean; onClose: () => void; children: ReactNode; title?: string; size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  const maxW = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full ${maxW} bg-surface border border-border rounded-panel shadow-soft max-h-[92vh] overflow-y-auto no-scrollbar animate-sheet sm:animate-slide`}>
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-surface/95 backdrop-blur border-b border-border">
            <h3 className="text-base font-semibold">{title}</h3>
            <button onClick={onClose} className="tap w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text">
              <X size={15} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ScanModal({ open, onClose, onResult }: { open: boolean; onClose: () => void; onResult: (name: string) => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Scan a card">
      <div className="relative aspect-[3/4] rounded-card bg-surface-2 border border-border overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center text-text-faint">
          <div className="text-center">
            <div className="text-sm">Position card in frame</div>
          </div>
        </div>
        <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-accent shadow-[0_0_12px_#e8b24c] scan-line" />
        <div className="absolute inset-4 border-2 border-accent/40 rounded-card pointer-events-none" />
      </div>
      <button
        onClick={() => { onResult('Charizard ex - SIR'); onClose(); }}
        className="tap w-full rounded-card bg-accent text-accent-ink font-semibold py-2.5 text-sm"
      >
        Simulate scan result
      </button>
    </Modal>
  );
}
