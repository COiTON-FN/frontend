import { type ReactNode, useEffect, useState, type FC } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { inspection, InspectionProps } from "@/utils/inspection";

const inspectionFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z
      .date({
        required_error: "Start date is required",
      })
      .refine(
        (date) => {
          // Get today's date with time set to midnight
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "Start date cannot be in the past",
        },
      ),
    time: z
      .string({
        required_error: "Start time is required",
      })
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in 24-hour format (HH:MM)",
      ),
    endDate: z
      .date({
        required_error: "End date is required",
      })
      .refine(
        (date) => {
          // Get today's date with time set to midnight
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "End date cannot be in the past",
        },
      ),
    endTime: z
      .string({
        required_error: "End time is required",
      })
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in 24-hour format (HH:MM)",
      ),
  })
  .refine(
    (data) => {
      // Check if end date is on or after start date
      if (data.date && data.endDate) {
        return data.endDate >= data.date;
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  );

type InspectionFormSchemaProps = z.infer<typeof inspectionFormSchema>;

interface InspectionFormProps {
  type?: "create" | "update";
  inspectionId?: string;
  children?: ReactNode;
}

const InspectionForm: FC<InspectionFormProps> = ({
  type = "create",
  inspectionId,
  children,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFetchingInspection, _] = useState(false);

  const form = useForm<InspectionFormSchemaProps>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      title: "This is my first inspection",
      description: "Something goes here",
      date: new Date("2025-05-19T23:00:00.000Z"),
      time: "09:21",
      endDate: new Date("2025-05-21T23:00:00.000Z"),
      endTime: "09:22",
    },
  });

  const {
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Watch for changes to the start date to update the minimum end date
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "date" && value.date) {
        setStartDate(value.date as Date);

        // If end date is before start date, update it
        const currentEndDate = getValues("endDate");
        if (currentEndDate && currentEndDate < value.date) {
          setValue("endDate", value.date as Date);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [getValues, setValue, watch]);

  // Fetch inspection data for update mode
  // useEffect(() => {
  //   async function fetchInspection() {
  //     if (!inspectionId) return; // Return early if no inspectionId

  //     try {
  //       setIsFetchingInspection(true);

  //       const response = await fetch(fullEndpoint, {
  //         method: "GET",
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch inspection");
  //       }

  //       const rawInspection = await response.json();
  //       // Ensure duration is [number, string]
  //       const duration =
  //         Array.isArray(rawInspection.data.duration) &&
  //         rawInspection.data.duration.length === 2
  //           ? ([
  //               Number(rawInspection.data.duration[0]),
  //               String(rawInspection.data.duration[1]),
  //             ] as [number, string])
  //           : ([1, "hour"] as [number, string]);

  //       const inspection: InspectionData = {
  //         id: rawInspection.id as string,
  //         data: {
  //           ...rawInspection.data,
  //           duration,
  //         },
  //       };

  //       // Parse the start date and time
  //       const startDate = parseISO(
  //         inspection.data.start.replace(" +0100", "Z"),
  //       );

  //       // Calculate end date and time based on duration
  //       const endDate = new Date(startDate);
  //       endDate.setHours(endDate.getHours() + inspection.data.duration[0]);

  //       // Format times for form inputs
  //       const startTime = format(startDate, "HH:mm");
  //       const endTime = format(endDate, "HH:mm");

  //       // Get today's date with time set to midnight
  //       const today = new Date();
  //       today.setHours(0, 0, 0, 0);

  //       // For existing inspections with past dates, we need to handle this specially
  //       if (startDate < today) {
  //         // Get today's date for the form
  //         const newStartDate = new Date();
  //         newStartDate.setHours(startDate.getHours(), startDate.getMinutes());

  //         // Update the end date based on the same duration
  //         const newEndDate = new Date(newStartDate);
  //         newEndDate.setHours(
  //           newEndDate.getHours() + inspection.data.duration[0],
  //         );

  //         // Format times for form inputs
  //         const newStartTime = format(newStartDate, "HH:mm");
  //         const newEndTime = format(newEndDate, "HH:mm");

  //         // Update form values with today's date instead of the past date
  //         form.reset({
  //           title: inspection.data.title,
  //           description: inspection.data.description,
  //           date: newStartDate,
  //           time: newStartTime,
  //           endDate: newEndDate,
  //           endTime: newEndTime,
  //         });

  //         // Set the start date for the end date calendar validation
  //         setStartDate(newStartDate);

  //         // Show a notification that the date was adjusted
  //         toast.error(
  //           "The inspection was scheduled in the past. The date has been adjusted to today.",
  //         );
  //       } else {
  //         // Normal case - date is not in the past
  //         form.reset({
  //           title: inspection.data.title,
  //           description: inspection.data.description,
  //           date: startDate,
  //           time: startTime,
  //           endDate: endDate,
  //           endTime: endTime,
  //         });

  //         // Set the start date for the end date calendar validation
  //         setStartDate(startDate);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching inspection:", err);
  //       toast("Failed to load inspection data. Please try again.");
  //     } finally {
  //       setIsFetchingInspection(false);
  //     }
  //   }

  //   // Only fetch if it's update mode AND we have an inspectionId
  //   if (type === "update" && inspectionId) {
  //     fetchInspection();
  //   }
  // }, [type, inspectionId, form]);

  const onSubmit = async (data: InspectionFormSchemaProps) => {
    try {
      // Format the start date and time
      const startDateObj = new Date(data.date);
      const startTimeArr = data.time.split(":");
      startDateObj.setHours(
        Number.parseInt(startTimeArr[0]),
        Number.parseInt(startTimeArr[1]),
      );

      // Format the end date and time
      const endDateObj = new Date(data.endDate);
      const endTimeArr = data.endTime.split(":");
      endDateObj.setHours(
        Number.parseInt(endTimeArr[0]),
        Number.parseInt(endTimeArr[1]),
      );

      // Calculate duration in hours
      const durationInMs = endDateObj.getTime() - startDateObj.getTime();
      const durationInHours = Math.max(
        Math.round(durationInMs / (1000 * 60 * 60)),
        1,
      );

      // Format to ISO string and adjust for timezone
      const formattedDate = startDateObj.toISOString().replace("Z", " +0100");

      const payload: InspectionProps = {
        type,
        payload: {
          id: inspectionId || "user-address",
          data: {
            title: data.title,
            description: data.description || "Be early!",
            start: formattedDate,
            duration: [durationInHours, "hour"],
          },
        },
      };

      console.log("CALLING INSPECTION ENDPOINT");
      const result = await inspection(payload);
      console.log("INSPECTION CALLED SUCCESSFULLY", result);

      // const response = await fetch(fullEndpoint, {
      //   method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (response.ok) {
      //   toast.success(
      //     type === "update" ? "Inspection updated" : "Inspection created",
      //   );

      //   // Reset form for create mode
      //   if (type === "create") {
      //     form.reset();
      //     setStartDate(undefined);
      //   }
      // } else {
      //   throw new Error(`Error: ${response.status}`);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        {isFetchingInspection ? (
          <div className="flex h-full items-center justify-center">
            <Loader className="size-5 animate-spin" />
            <span className="ml-2">Loading inspection data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
            >
              <SheetHeader>
                <SheetTitle className="font-sans">
                  {type === "update"
                    ? "Update Inspection"
                    : "Create Inspection"}
                </SheetTitle>
                <SheetDescription>
                  {type === "update"
                    ? "Modify the inspection details below."
                    : "Schedule a new inspection by filling out the form below."}
                </SheetDescription>
              </SheetHeader>

              <Separator className="my-6" />

              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Inspection title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add details about the inspection"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <div
                                  className={cn(
                                    "flex h-14 w-full items-center rounded-xl border px-4 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </div>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  return date < today;
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              placeholder="18:00"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <div
                                  className={cn(
                                    "flex h-14 w-full items-center rounded-xl border px-4 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </div>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);

                                  // Disable dates before today or before start date
                                  if (date < today) return true;
                                  if (startDate && date < startDate)
                                    return true;
                                  return false;
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              placeholder="21:00"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <SheetFooter className="pt-6">
                {type === "update" && (
                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </SheetClose>
                )}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  txt={type === "update" ? "Updating..." : "Creating..."}
                >
                  {type === "update"
                    ? "Update Inspection"
                    : "Create Inspection"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InspectionForm;
