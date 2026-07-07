'use client';

// Self-contained docs accordion for MDX. Built directly on the base-ui
// primitive rather than ./ui/accordion, which shadcn owns and overwrites on
// every re-install (that overwrite drops AccordionHeader and breaks this).
import { Accordion as Primitive } from '@base-ui/react/accordion';
import { Check, ChevronRight, LinkIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { useCopyButton } from '@fumadocs/base-ui/utils/use-copy-button';
import { buttonVariants } from './ui/button';
import { mergeRefs } from '../lib/merge-refs';
import { useTranslations } from '@fuma-translate/react';

export function Accordions({
  ref,
  className,
  defaultValue,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const composedRef = mergeRefs(ref, rootRef);
  const [value, setValue] = useState<unknown[]>(defaultValue ?? []);

  useEffect(() => {
    const id = window.location.hash.substring(1);
    const element = rootRef.current;
    if (!element || id.length === 0) return;

    const selected = document.getElementById(id);
    if (!selected || !element.contains(selected)) return;
    const value = selected.getAttribute('data-accordion-value');

    // Open the accordion item containing the hash target on mount; intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setValue((prev) => [value, ...prev]);
  }, []);

  return (
    <Primitive.Root
      ref={composedRef}
      value={value}
      onValueChange={setValue}
      className={(s) =>
        cn(
          'divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card',
          typeof className === 'function' ? className(s) : className,
        )
      }
      {...props}
    />
  );
}

export function Accordion({
  title,
  id,
  value = String(title),
  children,
  ...props
}: Omit<ComponentProps<typeof Primitive.Item>, 'value' | 'title'> & {
  title: string | ReactNode;
  value?: string;
}) {
  return (
    <Primitive.Item value={value} {...props}>
      <Primitive.Header
        id={id}
        data-accordion-value={value}
        className="scroll-m-24 not-prose flex flex-row items-center font-medium text-fd-card-foreground has-focus-visible:bg-fd-accent"
      >
        <Primitive.Trigger className="group flex flex-1 items-center gap-2 px-3 py-2.5 text-start focus-visible:outline-none">
          <ChevronRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-90" />
          {title}
        </Primitive.Trigger>
        {id ? <CopyButton id={id} /> : null}
      </Primitive.Header>
      <Primitive.Panel
        hiddenUntilFound
        className="h-(--accordion-panel-height) overflow-hidden transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0"
      >
        <div className="prose-no-margin px-4 pb-2 text-[0.9375rem] [&[hidden]:not([hidden='until-found'])]:hidden">
          {children}
        </div>
      </Primitive.Panel>
    </Primitive.Item>
  );
}

function CopyButton({ id }: { id: string }) {
  const t = useTranslations({ note: 'accordion' });
  const [checked, onClick] = useCopyButton(() => {
    const url = new URL(window.location.href);
    url.hash = id;

    return navigator.clipboard.writeText(url.toString());
  });

  return (
    <button
      type="button"
      aria-label={t('Copy Link', { note: 'aria-label' })}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          className: 'me-2 text-fd-muted-foreground',
        }),
      )}
      onClick={onClick}
    >
      {checked ? <Check className="size-3.5" /> : <LinkIcon className="size-3.5" />}
    </button>
  );
}
