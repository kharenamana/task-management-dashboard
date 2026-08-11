"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = themes.find((item) => item.value === theme) ?? themes[2];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Choose color theme"
          className="border-border bg-card hover:bg-muted grid size-11 place-items-center rounded-xl border transition disabled:opacity-60"
        >
          <CurrentIcon className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="border-border bg-card z-50 min-w-40 rounded-xl border p-1.5 shadow-xl"
        >
          {themes.map(({ value, label, icon: Icon }) => (
            <DropdownMenu.Item
              key={value}
              onSelect={() => setTheme(value)}
              className="hover:bg-muted focus:bg-muted flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold outline-none"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {theme === value ? (
                <Check className="size-4" aria-hidden="true" />
              ) : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
