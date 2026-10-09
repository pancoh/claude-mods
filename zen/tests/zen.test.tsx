import { describe, expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const PLUGIN = 'zen'

const hint = {
  component: 'PromptHint' as const,
  props: { isDraft: false, isWorking: false, hint: '? for shortcuts' },
}

const toolUse = {
  component: 'ToolUse' as const,
  requestId: 'call-1',
  props: { tool_use_id: 'call-1', tool: 'Bash', input: { command: 'ls' } },
}

// Faz o papel do desenho do próprio engine quando o mod passa a vez.
const engineDraws = (on: On) => {
  mock.store(on)
  on('ui.render', { component: 'PromptHint' }, () => ({ type: 'engine', ref: 0 }))
  on('ui.render', ($, e) => $.ui.resolve(e).Text({ children: 'engine' }))
}

describe('zen', () => {
  test('o botão liga e desliga o Zen e esconde as ferramentas', async ($, on) => {
    engineDraws(on)
    const corner = await $.ui.mount({ plugin: PLUGIN, surface: 'terminal', ...hint })
    expect((await corner.find({ key: 'zen-toggle' }))?.text).toMatch(/○ zen/)
    expect(await corner.find({ text: /\? for shortcuts/ })).toBeDefined()

    const row = await $.ui.mount({ plugin: PLUGIN, surface: 'terminal', ...toolUse } as never)
    expect(await row.find({ text: /engine/ })).toBeDefined()

    await corner.press({ key: 'zen-toggle' })
    expect((await corner.find({ key: 'zen-toggle' }))?.text).toMatch(/● zen/)
    await row.unmount()
    const hidden = await $.ui.mount({ plugin: PLUGIN, surface: 'terminal', ...toolUse } as never)
    expect(await hidden.find({ text: /engine/ })).toBeUndefined()

    await corner.press({ key: 'zen-toggle' })
    expect((await corner.find({ key: 'zen-toggle' }))?.text).toMatch(/○ zen/)
  })

  test('o botão de outro mod na linha de dicas fica, com o Zen depois dele', async ($, on) => {
    on('ui.render', { component: 'PromptHint' }, ($, e) => {
      const { Box, Text, Button } = $.ui.resolve(e)
      return Box({ children: [Text({ children: '? for shortcuts' }), Button({ key: 'clean-view-toggle', label: '● clean view', onPress: () => {} })] })
    })
    engineDraws(on)
    const corner = await $.ui.mount({ plugin: PLUGIN, surface: 'terminal', ...hint })
    expect(await corner.find({ key: 'clean-view-toggle' })).toBeDefined()
    expect(await corner.find({ key: 'zen-toggle' })).toBeDefined()
    expect(await corner.find({ text: /\? for shortcuts/ })).toBeDefined()
  })

  test('o comando /zen alterna o mesmo estado do botão', async ($, on) => {
    engineDraws(on)
    const corner = await $.ui.mount({ plugin: PLUGIN, surface: 'terminal', ...hint })
    expect((await $.command.run({ command: 'zen' })).text).toBe('Modo Zen ligado.')
    expect((await corner.find({ key: 'zen-toggle' }))?.text).toMatch(/● zen/)
    expect((await $.command.run({ command: 'zen' })).text).toBe('Modo Zen desligado.')
  })
})
