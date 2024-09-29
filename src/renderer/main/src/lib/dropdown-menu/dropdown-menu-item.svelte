<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
  import { cn } from '../utils'
  import { type ComponentType } from 'svelte'
  import { type Icon } from 'lucide-svelte'

  type $$Props = DropdownMenuPrimitive.ItemProps & {
    inset?: boolean
    variant?: 'default' | 'danger'
    icon?: ComponentType<Icon>
  }

  let className: $$Props['class'] = undefined
  export let inset: $$Props['inset'] = undefined
  export let variant: $$Props['variant'] = 'default'
  export let icon: $$Props['icon'] = undefined // Exportez la propriété icon
  export { className as class }
</script>

<DropdownMenuPrimitive.Item
  class={cn(
    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    variant === 'default' && 'data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-500',
    variant === 'danger' &&
      'text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-500',
    inset && 'pl-8',
    className
  )}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerdown
  on:pointerleave
  on:pointermove
>
  {#if icon}
    <svelte:component this={icon} class="mr-2" size={16} strokeWidth={2} />
  {/if}
  <slot />
</DropdownMenuPrimitive.Item>
