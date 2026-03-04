import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { MediaAsset } from '../../types/media';

interface DeleteAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  asset: MediaAsset | null;
  isLoading?: boolean;
}

export const DeleteAssetModal = ({ isOpen, onClose, onConfirm, asset, isLoading }: DeleteAssetModalProps) => {
  if (!asset) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Delete Asset"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text">Are you absolutely sure?</h3>
            <p className="text-sm text-text-muted mt-2 leading-relaxed">
              You are about to delete <span className="font-bold text-text">"{asset.title}"</span>. This action cannot be undone and will remove all associated variants.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button 
            variant="primary" 
            className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-500/20 font-bold"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Yes, Delete Asset'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl font-bold"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
