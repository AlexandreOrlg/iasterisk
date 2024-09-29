<script lang="ts">
  import { cn } from '../utils'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { ComponentType } from 'svelte'

  interface $$Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    icon?: ComponentType
    iconPosition?: 'left' | 'right'
    disabled?: boolean
  }

  let className: $$Props['class'] = undefined
  export let variant: $$Props['variant'] = 'primary'
  export let size: $$Props['size'] = 'sm'
  export let icon: $$Props['icon'] = undefined
  export let iconPosition: $$Props['iconPosition'] = 'left'
  export let disabled: $$Props['disabled'] = false
  export { className as class }

  const variants = {
    primary:
      'bg-blue-500 text-white border border-blue-500 bg-gradient-to-b from-white/05 to-transparent shadow-[inset_0_1px_rgba(255,255,255,0.15),_0_1px_2px_rgba(0,0,0,0.16)] hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none',
    secondary:
      'bg-white text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed'
  }

  const sizes = {
    sm: 'px-3 py-2 text-[13px]',
    lg: 'px-5 py-3 text-lg'
  }
</script>

<button
  class={cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap',
    variants[variant],
    sizes[size],
    className
  )}
  {disabled}
  {...$$restProps}
  on:click
>
  {#if icon && iconPosition === 'left'}
    <svelte:component this={icon} class="w-5 h-5" />
  {/if}
  <slot />
  {#if icon && iconPosition === 'right'}
    <svelte:component this={icon} class="w-5 h-5" />
  {/if}
</button>
