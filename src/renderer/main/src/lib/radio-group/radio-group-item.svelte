<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'
  import { cn } from '../utils'
  import { Circle } from 'lucide-svelte'

  type $$Props = RadioGroupPrimitive.ItemProps

  let className: $$Props['class'] = undefined
  export let value: $$Props['value']
  export { className as class }
</script>

<RadioGroupPrimitive.Item
  {value}
  class={cn(
    'border-blue-500 text-blue-500 ring-blue-500 focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  {...$$restProps}
  on:click
>
  <div class="flex items-center justify-center">
    <RadioGroupPrimitive.ItemIndicator>
      <Circle class="h-2.5 w-2.5 fill-current text-current" />
    </RadioGroupPrimitive.ItemIndicator>
  </div>
</RadioGroupPrimitive.Item>
