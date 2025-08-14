import React, { useState } from "react"
import CSidebar from "./CSidebar"
import CNavbar from "./CNavbar"

function CLayoutDashboard({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev)
    }
    return (
        <div className="flex h-screen">
            {/* Temporary (mobile) sidebar */}
            <CSidebar
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            />

            {/* Permanent (desktop) sidebar */}
            <div className="max-[900px]:hidden ">
                <CSidebar variant="permanent" />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Navbar */}
                <CNavbar onDrawerToggle={handleDrawerToggle} />

                {/* Page content, pushed below the AppBar (default 64px height) */}
                <main className="flex-1 max-[900px]:pt-[64px] p-2 max-[900px]:p-4 overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default CLayoutDashboard