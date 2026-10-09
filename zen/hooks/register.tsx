import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

// Ligado ou desligado; o valor também fica em $.store para as próximas sessões.
const isOn = atom({ plugin: 'zen', key: 'isOn' } as const, false)

async function toggle($: EngineInterface) {
  const next = await update($, isOn, on => !on)
  await $.store.set('isOn', next)
  return next
}

// A dica do engine pode vir em mais de uma linha; aqui ela vira uma só.
function oneLine(hint: string) {
  return hint
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '')
    .join(' · ')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    const saved = (await $.store.get('isOn')) === true
    await update($, isOn, () => saved)
    await $.command.register({ name: 'zen', description: 'Liga ou desliga o modo Zen' })
    return started
  })

  on('command.run', { command: 'zen' }, async $ => {
    const now = await toggle($)
    return { text: now ? 'Modo Zen ligado.' : 'Modo Zen desligado.' }
  })

  // Botão no canto direito da linha de dicas, sob o prompt. Se outro mod já
  // desenhou a linha (o botão do Clean View), ela fica e o Zen entra depois.
  on('ui.render', { component: 'PromptHint' }, async ($, e, next) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const zen = await read($, isOn)
    const below = await next(e)
    const row =
      below.type === 'engine' ? (
        <Text dimColor wrap="truncate">
          {oneLine(e.props.hint)}
        </Text>
      ) : (
        <Box flexGrow={1} flexShrink={1}>
          {below}
        </Box>
      )
    return (
      <Box justifyContent="space-between" flexGrow={1} gap={1}>
        {row}
        <Button key="zen-toggle" plain dimColor={!zen} label={zen ? '● zen' : '○ zen'} onPress={() => toggle($)} />
      </Box>
    )
  })

  // Com o Zen ligado, as linhas de ferramentas não são desenhadas.
  // Os pedidos de permissão são outro componente e continuam visíveis.
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) =>
    (await read($, isOn)) ? $.ui.resolve(e).Box({ display: 'none' }) : next(e),
  )
  on('ui.render', { component: 'ToolResult' }, async ($, e, next) =>
    (await read($, isOn)) ? $.ui.resolve(e).Box({ display: 'none' }) : next(e),
  )
  on('ui.render', { component: 'ToolGroup' }, async ($, e, next) =>
    (await read($, isOn)) ? $.ui.resolve(e).Box({ display: 'none' }) : next(e),
  )
  on('ui.render', { component: 'ToolProgress' }, async ($, e, next) =>
    (await read($, isOn)) ? $.ui.resolve(e).Box({ display: 'none' }) : next(e),
  )
}
