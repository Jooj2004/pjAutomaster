import React, { useContext, useEffect } from "react"
import backgroundImage from "./img/home_backgroud.png"
import { AuthContext } from "./context/AuthContext"
import { useNavigate } from "react-router-dom"

const App = () => {
  const { isAuthenticated, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redireciona após validação
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return <div>Carregando...</div> // 🔄 ou um spinner bonitão
  }

  return (
    <section
      className="content-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>Bem-vindo à AutoMaster!</h1>
      <p>
        Sua oficina de confiança para reparos e serviços automotivos.
        Navegue por nossa página para saber mais sobre nossos serviços e
        como podemos ajudar você a manter seu carro em perfeitas condições.
      </p>
    </section>
  )
}

export default App