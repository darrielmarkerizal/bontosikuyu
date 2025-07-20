"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Writer {
  id: number;
  fullName: string;
  dusun: string;
}

interface WriterComboboxProps {
  writers: Writer[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function WriterCombobox({
  writers,
  value,
  onValueChange,
  placeholder = "Pilih penulis...",
  disabled = false,
}: WriterComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedWriter = writers.find(
    (writer) => writer.id.toString() === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedWriter ? (
            <span className="truncate">
              {selectedWriter.fullName} - {selectedWriter.dusun}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari penulis..." />
          <CommandList>
            <CommandEmpty>Tidak ada penulis ditemukan.</CommandEmpty>
            <CommandGroup>
              {writers.map((writer) => (
                <CommandItem
                  key={writer.id}
                  value={`${writer.fullName} ${writer.dusun}`}
                  onSelect={() => {
                    onValueChange(writer.id.toString());
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === writer.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{writer.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {writer.dusun}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
