import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`modal-content ${className}`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2>{title}</h2>
                        <button onClick={onClose} className="btn-ghost p-2" title="Cerrar">
                            <X size={20} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
