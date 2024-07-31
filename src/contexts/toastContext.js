import { useContext, useState } from "react";
import { createContext } from "react";
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext({
    triggerToast: (text, type) => { },
});

export const useToastState = () => useContext(ToastContext);

export const ToastStateProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [type, setType] = useState('error');

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setText('');
        setType('');
    };
    const triggerToast = (text, type) => {
        handleClick();
        setText(text);
        setType(type);
    }

    return (
        <ToastContext.Provider value={{ triggerToast }}>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    marginTop: '40px',
                    zIndex: 9999999
                }}
            >
                <Alert onClose={handleClose} severity={type}
                    sx={{
                        width: '100%'
                    }}
                >
                    {text}
                </Alert>
            </Snackbar>
            {children}
        </ToastContext.Provider>
    );
};
