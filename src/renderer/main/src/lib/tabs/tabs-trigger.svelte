<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui'
  import { cn } from '../utils'

  type $$Props = TabsPrimitive.TriggerProps
  type $$Events = TabsPrimitive.TriggerEvents

  let className: $$Props['class'] = undefined

  export let value: $$Props['value']
  export { className as class }
</script>

<TabsPrimitive.Trigger
  class={cn(
    '!data-[state=active]:text-white data-[state=active]:bg-gradient-to-b from-white/10 to-transparent data-[state=active]:border data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500',
    'ring-offset-white focus-visible:ring-ring data-[state=active]:text-neutral-500 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    className,
    'trigger'
  )}
  {value}
  {...$$restProps}
  on:click
>
  <slot />
</TabsPrimitive.Trigger>

<style global>
  :global(.trigger[data-state='active']) {
    color: white;
    box-shadow:
      inset 0 1px 0px 0 rgba(255, 255, 255, 0.1),
      0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
</style>
