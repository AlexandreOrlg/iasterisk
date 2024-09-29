<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui'
  import { cn } from '../utils'

  type $$Props = TabsPrimitive.ListProps

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<TabsPrimitive.List
  class={cn(
    'bg-white text-neutral-600 border border-zinc-200 inline-flex h-10 items-center justify-center rounded-lg p-0.5',
    className
  )}
  {...$$restProps}
>
  <slot />
</TabsPrimitive.List>
