import * as React from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@src/components/ui/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/src/components/ui/popover.tsx";
import type { ComboboxDemoProps } from "~/utils/types";

export function ComboboxDemo({ value, onChange }: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? gradeLevels.find((gradeLevel) => gradeLevel.value === value)
                ?.label
            : "Select Grade Level..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search grade level..." />
          <CommandEmpty>No gradeLevel found.</CommandEmpty>
          <CommandGroup>
            {gradeLevels.map((gradeLevel) => (
              <CommandItem
                key={gradeLevel.value}
                value={gradeLevel.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === gradeLevel.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {gradeLevel.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const promptSuggestions = [
  "Students with dyslexia",
  "Students with cognitive disabilities",
  "Students who are more advanced",
  "Students who are more visual learners",
];

export const generateFormSchema = z.object({
  lessonObjective: z.string().min(1),
  gradeLevel: z.string().min(1),
  specialNeeds: z.string(),
});

export type GenerateFormValues = z.infer<typeof generateFormSchema>;

export const gradeLevels = [
  {
    value: "1st grade",
    label: "1st Grade",
  },
  {
    value: "2nd grade",
    label: "2nd Grade",
  },
  {
    value: "3rd grade",
    label: "3rd Grade",
  },
  {
    value: "4th grade",
    label: "4th Grade",
  },
  {
    value: "5th grade",
    label: "5th Grade",
  },
  {
    value: "6th grade",
    label: "6th Grade",
  },
  {
    value: "7th grade",
    label: "7th Grade",
  },
  {
    value: "8th grade",
    label: "8th Grade",
  },
  {
    value: "9th grade",
    label: "9th Grade",
  },
  {
    value: "10th grade",
    label: "10th Grade",
  },
  {
    value: "11th grade",
    label: "11th Grade",
  },
  {
    value: "12th grade",
    label: "12th Grade",
  },
];
