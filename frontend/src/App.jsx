import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [pessoas, setPessoas] = useState([]);

    const buscarPessoas = async () => {
        const resposta = await fetch("http://localhost:3000/pessoas");
        const dados = await resposta.json();
        setPessoas(dados);
    };

    useEffect(() => {
        buscarPessoas();
    }, []);

    const cadastrar = async (e) => {
        e.preventDefault();

        const resposta = await fetch("http://localhost:3000/pessoas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                cpf,
                email
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Erro ao cadastrar");
            return;
        }

        setNome("");
        setCpf("");
        setEmail("");

        buscarPessoas();
    };

    return (
        <div className="container">
            <h1>Cadastro de Usuários</h1>

            <form onSubmit={cadastrar}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>

            <section className="usuarios">
                <h2>Usuários cadastrados</h2>

                {pessoas.length === 0 ? (
                    <p>Nenhum usuário cadastrado.</p>
                ) : (
                    pessoas.map((pessoa) => (
                        <div className="usuario" key={pessoa.id}>
                            <h3>{pessoa.nome}</h3>
                            <p>CPF: {pessoa.cpf}</p>
                            <p>E-mail: {pessoa.email}</p>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

export default App;