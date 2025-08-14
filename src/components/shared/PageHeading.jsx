'use client'
import { Typography } from '@mui/material'

export default function PageHeading({ children }) {
    return (
        <Typography
            variant="h4"
            sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1,
                fontSize: {
                    xs: '1.5rem',  // mobile
                    sm: '1.75rem',
                    md: '2rem',
                    lg: '2.25rem',
                    xl: '2.5rem',
                },
            }}
        >
            {children}
        </Typography>
    )
}
