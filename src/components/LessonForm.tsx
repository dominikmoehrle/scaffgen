"use client";

import * as React from "react";

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
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import LoadingDots from "@/components/ui/loadingdots";
import { PromptSuggestion } from "@/components/PromptSuggestion";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Controller } from "react-hook-form";

import { getOpenAICompletion } from "./openAi";
import {
  GenerateFormValues,
  generateFormSchema,
  ComboboxDemo,
  promptSuggestions,
} from "./FormComponents";

const LessonForm = ({
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
      setIsLoading(true);
      try {
        // request
        console.log("Sending off the request now");
        const data = await getOpenAICompletion(
          values.lessonObjective,
          values.gradeLevel,
          values.specialNeeds,
        );

        console.log("Successfully reived the data");
        console.log("Data is: " + data.id);

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
                          placeholder="A lesson objective you would like to generate scaffolds for"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        Feel free to be very precise or more broad.
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

export default LessonForm;
