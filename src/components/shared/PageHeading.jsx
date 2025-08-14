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
                    xs: '1.2rem',  // mobile
                    sm: '1.3rem',
                    md: '1.4rem',
                    lg: '1.6rem',
                    xl: '1.7rem',
                },
            }}
        >
            {children}
        </Typography>
    )
}
