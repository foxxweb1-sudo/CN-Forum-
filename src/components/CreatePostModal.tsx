import React from 'react';
import { 
  User 
} from '../firebase';
import { 
  PostComposer 
} from './PostComposer';
import { 
  X, 
  Terminal, 
  ShieldCheck 
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  user,
  onRequireLogin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-mono">
              طرح موضوع / مشاركة كود في المنتدى
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <PostComposer
            user={user}
            onRequireLogin={onRequireLogin}
            onSuccessPost={onClose}
          />
        </div>

      </div>
    </div>
  );
};
