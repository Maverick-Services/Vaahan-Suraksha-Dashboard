import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#0cf',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
})

export default theme
