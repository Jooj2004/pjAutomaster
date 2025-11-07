export const ClienteItem = ({cliente}) => (
    <tr>
        <td data-label="Nome">{cliente.nome}</td>
        <td data-label="Email">{cliente.email}</td>
        <td data-label="Telefone" >{cliente.telefone}</td>
        <td data-label="Endereço">{cliente.endereco}</td>
    </tr>
)