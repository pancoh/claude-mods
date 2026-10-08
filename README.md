# claude-mods

Mods pessoais para o Claude Code.

| Mod | O que faz |
|---|---|
| `zen` | Esconde as chamadas de ferramentas e a saída delas. Liga e desliga pelo botão **○ zen** abaixo do prompt ou pelo comando `/zen`. |

## Instalação

No Claude Code, num terminal, digite um comando de cada vez no prompt:

```
/plugin marketplace add pancoh/claude-mods
/plugin install zen@ramson-mods
```

Não é preciso conta no GitHub. O mod foi testado no Claude Code 2.1.294.

Para atualizar: `/plugin update zen@ramson-mods`.

Para desinstalar: `/plugin uninstall zen@ramson-mods`. Se quiser remover também o marketplace: `/plugin marketplace remove ramson-mods`.

## Desenvolvimento

Com o marketplace adicionado a partir desta pasta (`claude plugin marketplace add ~/.claude/mods`), o Claude Code lê os arquivos daqui. Depois de editar, rode `/reload-plugins`.

```
claude plugin validate ./zen
claude plugin test ./zen
```
