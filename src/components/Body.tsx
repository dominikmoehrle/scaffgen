"use client";

import * as React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import LoadingDots from "@/components/ui/loadingdots";
import { PromptSuggestion } from "@/components/PromptSuggestion";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Controller } from "react-hook-form";

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
import { NextResponse } from "next/server";
import { getOpenAICompletion } from "./openAi";

const gradeLevels = [
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

type ComboboxDemoProps = {
  value: string;
  onChange: (value: string) => void;
};

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

const promptSuggestions = [
  "Students with dyslexia",
  "Students with cognitive disabilities",
  "Students who are more advanced",
  "Students who are more visual learners",
];

const generateFormSchema = z.object({
  lessonObjective: z.string().min(1),
  gradeLevel: z.string().min(1),
  specialNeeds: z.string(),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const Body = ({
  imageUrl,
  prompt,
  redirectUrl,
  modelLatency,
  id,
}: {
  imageUrl?: string;
  prompt?: string;
  redirectUrl?: string;
  modelLatency?: number;
  id?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  //const [response, setResponse] = useState<QrGenerateResponse | null>(null);

  const router = useRouter();

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: "onChange",

    // Set default values so that the form inputs are controlled components.
    defaultValues: {
      lessonObjective: "",
      gradeLevel: "",
      specialNeeds: "",
    },
  });

  const handleSubmit = useCallback(
    async (values: GenerateFormValues) => {
      console.log("in the handleSubmit now");
      setIsLoading(true);
      //setResponse(null);
      console.log("trying to send it aways");
      try {
        // request
        console.log("Sending off the request now");
        // console.log(JSON.stringify(request));

        const response = await fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify({
            lessonObjective: values.lessonObjective,
            gradeLevel: values.gradeLevel,
            specialNeeds: values.specialNeeds,
          }),
        });

        // Handle API errors.
        if (!response.ok || response.status !== 200) {
          const text = await response.text();
          console.log(error);
          throw new Error(
            `Failed to generate lesson scaffolds: ${response.status}, ${text}`,
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        // console.log(data);
        // va.track("Generated QR Code", {
        //   prompt: values.prompt,
        // });

        // const data = await getOpenAICompletion(
        //   values.lessonObjective,
        //   values.gradeLevel,
        //   values.specialNeeds,
        // );

        console.log("Successfully reived the data");
        console.log("Data is: " + data);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        router.push(`/start/${data.id}`);
      } catch (error) {
        console.log("Error is:");
        console.log(
          error instanceof Error ? error.message : "Unexpected Error",
        );
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return (
    <div className="mb-0 flex w-full flex-col items-center justify-center p-4 sm:mb-28 lg:p-0">
      <div className="mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-1 md:gap-12">
        <div className="col-span-1">
          <h1 className="mb-10 text-3xl font-bold">Generate your Scaffolds</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                {/* First form field */}
                <FormField
                  control={form.control}
                  name="lessonObjective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A city view with clouds"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        This is what the image in your QR code will look like.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="my-2">
                  <p className="mb-3 text-sm font-medium">Grade</p>
                  <Controller
                    name="gradeLevel"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <ComboboxDemo value={value} onChange={onChange} />
                    )}
                  />
                </div>
                <div className="my-2">
                  <p className="mb-3 text-sm font-medium">Special Needs</p>
                  <Controller
                    name="specialNeeds"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <div className="grid grid-cols-1 gap-3 text-center text-sm text-gray-500 sm:grid-cols-2">
                        {promptSuggestions.map((suggestion) => (
                          <PromptSuggestion
                            key={suggestion}
                            suggestion={suggestion}
                            onClick={() => onChange(suggestion)}
                            className={
                              value === suggestion
                                ? " bg-[rgb(15,23,42)] text-white hover:bg-[rgb(15,23,42)]" // Styles for selected suggestion
                                : " bg-white text-black hover:bg-gray-200" // Styles for unselected suggestion
                            }
                            isLoading={isLoading}
                          />
                        ))}
                      </div>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mx-auto inline-flex
                 w-full max-w-[200px] justify-center"
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
                  ) : false ? (
                    "✨ Regenerate"
                  ) : (
                    "Generate"
                  )}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Body;
