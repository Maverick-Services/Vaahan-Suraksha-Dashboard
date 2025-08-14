import React from 'react'

function InnerDashboardLayout({ children }) {
    return (
        <div className='w-full p-2 sm:p-2 scroll-smooth'>
            {children}
        </div>
    )
}

export default InnerDashboardLayout
