import { useState } from "react";
import Sidebar from "./sidebar";
import "../../css/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {open && (
        <div className="fundo" onClick={()=>setOpen(false)}>
          <div className="mobile-sidebar">
            <div className="close-sidebar" onClick={()=>setOpen(false)}>
              X
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </nav>
  )
}