import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ show, onClose, children }: ModalProps) {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        // Permite contenido personalizado sin título fijo
        className="p-0 overflow-hidden bg-background border-border"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
