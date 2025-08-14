'use client'
import { Typography } from '@mui/material'

export default function PageHeading({ children }) {
    return (
        <Typography
            variant="h4"
            sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: {
                    xs: '1.5rem',  // mobile
                    sm: '1.75rem',
                    md: '2rem',
                    lg: '2rem',
                    xl: '2rem',
                },
            }}
        >
            {children}
        </Typography>
    )
}
