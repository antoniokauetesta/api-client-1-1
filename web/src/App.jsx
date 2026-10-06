import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function maskCpf(cpf) {
  const digits = String(cpf ?? "").replace(/\D/g, "");
  if (digits.length !== 11) return "CPF inválido";
  return `•••.•••.•••-${digits.slice(-2)}`;
}

export default function App() {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState({ kind: "loading", text: "Buscando cadastros…" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const loadingRef = useRef(false);

  const loadPeople = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch("/pessoas", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Não foi possível carregar os cadastros (HTTP ${response.status}).`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("A resposta do servidor está em um formato inesperado.");
      }

      setPeople(data);
      setStatus({ kind: "ready", text: "" });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : "Erro ao carregar os cadastros.",
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  useEffect(() => {
    const interval = window.setInterval(loadPeople, 15000);
    return () => window.clearInterval(interval);
  }, [loadPeople]);

  const filteredPeople = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return people.filter((person) => {
      const searchable = `${person.nome ?? ""} ${person.email?.email ?? ""} ${person.cpf ?? ""}`;
      return searchable.toLocaleLowerCase("pt-BR").includes(query);
    });
  }, [people, search]);

  const countLabel = `${filteredPeople.length} ${
    filteredPeople.length === 1 ? "cliente" : "clientes"
  }`;

  async function handleCreatePerson(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setFormError("");

    const formData = new FormData(form);
    const payload = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      cpf: formData.get("cpf"),
    };

    try {
      const response = await fetch("/pessoas", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.erro || `Não foi possível criar o cadastro (HTTP ${response.status}).`);
      }

      setPeople((currentPeople) => [result, ...currentPeople]);
      form.reset();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Erro ao criar cadastro.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/clientes" aria-label="Painel de clientes">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Clientes</span>
        </a>
        <span className="status"><span className="status-dot" />Painel interno</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">GESTÃO DE PESSOAS</p>
        <h1 id="page-title">Clientes</h1>
        <p className="subtitle">Os cadastros registrados no sistema aparecem nesta lista.</p>
      </section>

      <section className="panel" aria-label="Lista de clientes">
        <div className="panel-heading">
          <div>
            <h2>Clientes cadastrados</h2>
            <p className="result-count">
              {status.kind === "loading" ? "Carregando cadastros…" : countLabel}
            </p>
          </div>
          <button
            className="refresh-button"
            type="button"
            onClick={loadPeople}
            disabled={loading}
          >
            <span aria-hidden="true">↻</span>
            Atualizar
          </button>
        </div>

        <label className="search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Buscar por nome, e-mail ou CPF</span>
          <input
            type="search"
            placeholder="Buscar por nome, e-mail ou CPF"
            autoComplete="off"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <form className="cadastro-form" onSubmit={handleCreatePerson}>
          <h3>Adicionar cliente</h3>
          <div className="form-fields">
            <label>
              Nome
              <input name="nome" type="text" autoComplete="name" required />
            </label>
            <label>
              E-mail
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              CPF
              <input
                name="cpf"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                pattern="[\d.\/-]{11,14}"
                title="Digite um CPF com 11 números"
                placeholder="000.000.000-00"
                required
              />
            </label>
            <button className="refresh-button submit-button" type="submit" disabled={saving}>
              {saving ? "Salvando…" : "Cadastrar"}
            </button>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
        </form>

        {status.kind !== "ready" ? (
          <div
            className={`message visible${status.kind === "error" ? " error" : ""}`}
            role={status.kind === "error" ? "alert" : "status"}
          >
            {status.text}
          </div>
        ) : people.length === 0 ? (
          <div className="message visible" role="status">
            Ainda não há pessoas cadastradas.
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="message visible" role="status">
            Nenhum cadastro encontrado para essa busca.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Senha</th>
                  <th scope="col">CPF</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => (
                  <tr key={person.id}>
                    <td>{person.nome || "Nome não informado"}</td>
                    <td>{person.email?.email || "E-mail não informado"}</td>
                    <td><span className="password-status">Não armazenada</span></td>
                    <td>{maskCpf(person.cpf)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="privacy-note">
          Senhas não são armazenadas no cadastro atual. Por segurança, os CPFs aparecem parcialmente.
        </p>
      </section>
      <footer>Os dados são carregados do cadastro do sistema.</footer>
    </main>
  );
}
