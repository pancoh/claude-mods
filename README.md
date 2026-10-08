# claude-mods

Mods pessoais para o Claude Code.

| Mod | O que faz |
|---|---|
| `zen` | Esconde as chamadas de ferramentas e a saída delas. Liga e desliga pelo botão **○ zen** abaixo do prompt ou pelo comando `/zen`. |

## Instalação

No Claude Code, num terminal:

```
/plugin install zen --marketplace pancoh/claude-mods
```

Como o repositório é privado, o `gh` ou o git precisam estar autenticados na conta dona dele.

## Desenvolvimento

Com o marketplace adicionado a partir desta pasta (`claude plugin marketplace add ~/.claude/mods`), o Claude Code lê os arquivos daqui. Depois de editar, rode `/reload-plugins`.

```
claude plugin validate ./zen
claude plugin test ./zen
```
