import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center text-center gap-4">
                <div className={`${type === 'danger' ? 'text-error' : 'text-primary'}`}>
                    <AlertCircle size={48} />
                </div>
                <p className="text-muted">{message}</p>
                <div className="flex gap-4 w-full mt-4">
                    <button onClick={onClose} className="btn btn-secondary flex-1 justify-center">
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`btn flex-1 justify-center ${type === 'danger' ? 'bg-error text-white border-error hover:bg-red-600' : 'btn-primary'}`}
                        style={type === 'danger' ? { backgroundColor: 'var(--error)', borderColor: 'var(--error)', color: 'white' } : {}}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
