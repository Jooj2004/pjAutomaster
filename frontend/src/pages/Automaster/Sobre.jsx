const SobreNos = () => {
  return (
    <div className="sobre-container">
      <h1>Sobre Nós</h1>
      <div className="sobre-row">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70" 
            alt="Oficina Mecânica" 
            className="sobre-img"
          />
        </div>
        <div className="sobre-text">
          <h3>Quem Somos</h3>
          <p>Somos uma oficina mecânica especializada...</p>
          <h3>Nossa Missão</h3>
          <p>Garantir a segurança e tranquilidade...</p>
          <h3>Por que escolher nossa oficina?</h3>
          <ul>
            <li>Equipe altamente qualificada</li>
            <li>Peças de primeira linha</li>
            <li>Atendimento rápido e transparente</li>
            <li>Preços justos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SobreNos;