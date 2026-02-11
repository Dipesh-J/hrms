import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const Toast = ({ id, type = 'info', message, duration = 3000, onClose }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, id, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <XCircle size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            default: return <Info size={20} />;
        }
    };

    const getStyles = () => {
        const baseStyle = {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '300px',
            maxWidth: '400px',
            borderLeft: '4px solid',
            marginBottom: '10px',
            color: 'var(--text-primary)',
            animation: 'slide-in 0.3s ease-out',
        };

        switch (type) {
            case 'success': return { ...baseStyle, borderLeftColor: 'var(--success-color)' };
            case 'error': return { ...baseStyle, borderLeftColor: 'var(--danger-color)' };
            case 'warning': return { ...baseStyle, borderLeftColor: 'var(--warning-color)' };
            default: return { ...baseStyle, borderLeftColor: 'var(--primary-color)' };
        }
    };

    return (
        <div style={getStyles()} role="alert">
            <div style={{ color: type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'inherit' }}>
                {getIcon()}
            </div>
            <p style={{ margin: 0, flex: 1, fontSize: '14px', lineHeight: '1.4' }}>{message}</p>
            <button
                onClick={() => onClose(id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, display: 'flex' }}
                aria-label="Close"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
