export type ZenFlag = boolean

declare module 'claude-code' {
  interface PluginState {
    zen: { isOn: ZenFlag }
  }
}
