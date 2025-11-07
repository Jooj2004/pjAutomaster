import React, { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verifica se já existe token salvo e valida no backend
  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (storedToken) {
      setToken(storedToken)

      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:3001/auth/validate", {
            headers: { Authorization: `Bearer ${storedToken}` },
          })

          const data = await res.json()

          if (res.ok) {
            setUser(data.user) // Backend já retorna user
          } else {
            // Se token inválido, limpa tudo
            localStorage.removeItem("token")
            setUser(null)
            setToken(null)
          }
        } catch (err) {
          console.error("Erro ao validar token:", err)
          localStorage.removeItem("token")
          setUser(null)
          setToken(null)
        } finally {
          setLoading(false)
        }
      }

      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem("token", jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}