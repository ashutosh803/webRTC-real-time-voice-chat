import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import styles from "./Navigation.module.css"

const Navigation = () => {
  const brandStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
  }

  const logoText = {
    marginLeft: '10px'
  }

  return (
    <div>
      <nav className={`${styles.navbar} container`}>
        <Link style={brandStyle} to={"/"}>
        <img src='/images/logo.png'></img>
        <span style={logoText}>Talkify</span></Link>
      </nav>
      <Outlet/>
    </div>
  )
}

export default Navigation
