import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e5ff', // Neon Cyan
            contrastText: '#000',
        },
        secondary: {
            main: '#d500f9', // Neon Purple
        },
        background: {
            default: '#14181f', // Lovable Dark Blue/Gray
            paper: '#1a1f2b',   // Slightly lighter/blue tint for cards
        },
        error: {
            main: '#ff1744',
        },
        warning: {
            main: '#ffea00',
        },
        success: {
            main: '#00e676',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '0.02em',
        },
        h6: {
            fontWeight: 600,
            letterSpacing: '0.01em',
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(30, 36, 50, 0.7)', // Semi-transparent based on new bg
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px', // specific rounded-lg feel
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 229, 255, 0.15) !important',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(0, 229, 255, 0.25) !important',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;
