import { z } from "zod";
import type { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  InspectionDataProps,
  InspectionPayload,
} from "@/pages/(app)/property-details/_components/inspection-card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DatetimePicker } from "../ui/datetime-picker";

interface InspectionFormProps {
  type?: "create" | "update";
  location?: string;
  inspectionId?: string;
  inspectionData?: InspectionDataProps["data"] | null;
  handleUpdateInspection?: (data: InspectionPayload) => void;
  handleCreateInspection?: (data: InspectionPayload) => void;
  isFetchingInspection?: boolean;
  isUpdatingInspection?: boolean;
  isCreatingInspection?: boolean;
  children?: ReactNode;
}

const inspectionFormSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .min(2, {
        message: "Title must be at least 2 characters long",
      })
      .max(50, {
        message: "Title must not exceed 50 characters",
      }),
    description: z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .min(5, {
        message: "Description must be at least 5 characters long",
      })
      .max(500, {
        message: "Description must not exceed 500 characters",
      }),
    start: z.coerce.date(),
    end: z.coerce.date(),
    location: z
      .string({
        invalid_type_error: "Location must be a string",
      })
      .optional(),
    duration: z.tuple([
      z.number({
        required_error: "Duration must include a number",
        invalid_type_error: "First element of duration must be a number",
      }),
      z.string({
        required_error: "Duration must include a time unit",
        invalid_type_error: "Second element of duration must be a string",
      }),
    ]),
  })
  .refine((data) => data.start > new Date(), {
    message: "Start date must be in the future",
    path: ["start"],
  })
  .refine((data) => data.end > data.start, {
    message: "End date must be after start date",
    path: ["end"],
  })
  .refine(
    (data) => {
      const now = new Date();
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);
      const isStartToday = startDate.toDateString() === now.toDateString();

      const endIsBeforeToday =
        endDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return !(isStartToday && endIsBeforeToday);
    },
    {
      message: "End date cannot be in the past if start date is today",
      path: ["end"],
    },
  );

type InspectionFormSchemaProps = z.infer<typeof inspectionFormSchema>;

const InspectionForm: FC<InspectionFormProps> = ({
  type,
  inspectionId,
  children,
  location,
  handleCreateInspection,
  handleUpdateInspection,
  inspectionData,
}) => {
  const form = useForm<InspectionFormSchemaProps>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      title: inspectionData?.data?.title || "",
      description:
        inspectionData?.data?.description ||
        "Join us for a scheduled inspection of this prime real estate opportunity. Walk through the property, assess its condition, and visualize its potential. Our agents will be on-site to answer questions, provide details, and guide you through the inspection process. Ideal for buyers, investors, and agents conducting due diligence.",
      start: new Date(),
      end: new Date(),
      location: inspectionData?.data?.location || location || "",
      duration: inspectionData?.data?.duration || [1, "hour"],
    },
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (data: InspectionFormSchemaProps) => {
    const start = new Date(data.start);
    const end = new Date(data.end);

    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const duration: [number, string] = [Math.round(diffHours), "hour"];

    if (!inspectionId || !data.location) {
      throw new Error("Inspection ID and location are required.");
    }

    const nowISOString = new Date().toISOString();

    const payload = {
      id: inspectionId,
      createdAt: nowISOString,
      updatedAt: nowISOString,
      data: {
        ...data,
        location: data.location,
        duration: duration as [1, "hour"],
        start: start.toISOString().replace("Z", " +0100"),
        end: end.toISOString().replace("Z", " +0100"),
      },
    };

    try {
      if (type === "create") {
        const result = await handleCreateInspection?.(payload);
        console.log("Create result:", result);
      } else if (type === "update") {
        const result = await handleUpdateInspection?.({ data: payload.data });
        console.log("Update result:", result);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred";
      console.error("Error submitting inspection form:", message);
      // Handle error (e.g., show toast notification)
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <SheetHeader>
              <SheetTitle className="font-sans">
                {type === "update" ? "Update Inspection" : "Create Inspection"}
              </SheetTitle>
              <SheetDescription>
                {type === "update"
                  ? "Modify the inspection details below."
                  : "Schedule a new inspection by filling out the form below."}
              </SheetDescription>
            </SheetHeader>

            <Separator className="my-6" />

            <div className="flex h-full flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title of your inspection/event</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Property Inspection"
                        error={!!errors.title}
                        {...field}
                      />
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
                    <FormLabel>
                      Add a description about your event/inspection
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        error={!!errors.description}
                        className="min-h-[120px]"
                        placeholder="Scheduled inspection for property viewing."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="start"
                disabled={!!location}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's the best time for you?</FormLabel>
                    <FormControl>
                      <DatetimePicker
                        {...field}
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                disabled={!!location}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When is it ending?</FormLabel>
                    <FormControl>
                      <DatetimePicker
                        {...field}
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="mt-auto">
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? type === "update"
                    ? "Updating..."
                    : "Creating..."
                  : type === "update"
                    ? "Update Inspection"
                    : "Create Inspection"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default InspectionForm;

// import { type ReactNode, useEffect, useState, type FC } from "react";
// import { z } from "zod";
// import { format, parseISO } from "date-fns";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CalendarIcon, Loader } from "lucide-react";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import { inspection } from "@/utils/inspection";
// import { toast } from "sonner";

// const inspectionFormSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().optional(),
//   date: z.date({ required_error: "Start date is required" }).refine(
//     (date) => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return date >= today;
//     },
//     { message: "Start date cannot be in the past" },
//   ),
//   time: z
//     .string({ required_error: "Start time is required" })
//     .regex(
//       /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
//       "Time must be in 24-hour format (HH:MM)",
//     ),
// });

// type InspectionFormSchemaProps = z.infer<typeof inspectionFormSchema>;

// interface InspectionFormProps {
//   type?: "create" | "update";
//   inspectionId?: string;
//   children?: ReactNode;
// }

// const InspectionForm: FC<InspectionFormProps> = ({
//   type = "create",
//   inspectionId,
//   children,
// }) => {
//   const [isFetchingInspection, setIsFetchingInspection] = useState(false);

// const form = useForm<InspectionFormSchemaProps>({
//   resolver: zodResolver(inspectionFormSchema),
//   defaultValues: {
//     title: "",
//     description: "",
//     date: undefined,
//     time: "",
//   },
// });

// const {
//   formState: { isSubmitting },
// } = form;

//   useEffect(() => {
//     async function fetchInspection() {
//       if (!inspectionId) return;

//       try {
//         setIsFetchingInspection(true);

//         const rawInspection = await inspection({
//           type: "get",
//           payload: { id: inspectionId }, // valid shape for GET
//         });

//         if (!rawInspection || !rawInspection.data) {
//           throw new Error("Inspection not found");
//         }

//         const rawDuration = rawInspection.data.duration;

//         const duration: [number, string] =
//           Array.isArray(rawDuration) && rawDuration.length === 2
//             ? [Number(rawDuration[0]), String(rawDuration[1])]
//             : [1, "hour"];

//         const rawStart = rawInspection.data.start;
//         if (!rawStart || typeof rawStart !== "string") {
//           throw new Error("Inspection start date is missing or invalid.");
//         }

//         const startDate = parseISO(rawStart.replace(" +0100", "Z"));
//         const endDate = new Date(startDate);
//         endDate.setHours(endDate.getHours() + duration[0]);

//         const startTime = format(startDate, "HH:mm");

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         if (startDate < today) {
//           const newStart = new Date();
//           newStart.setHours(startDate.getHours(), startDate.getMinutes());
//           const newEnd = new Date(newStart);
//           newEnd.setHours(newEnd.getHours() + duration[0]);

//           form.reset({
//             title: rawInspection.data.title,
//             description: rawInspection.data.description,
//             date: startDate,
//             time: startTime,
//           });

//           toast.error(
//             "The inspection was scheduled in the past. The date has been adjusted to today.",
//           );
//         } else {
//           form.reset({
//             title: rawInspection.data.title,
//             description: rawInspection.data.description,
//             date: startDate,
//             time: startTime,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching inspection:", err);
//         toast("Failed to load inspection data. Please try again.");
//       } finally {
//         setIsFetchingInspection(false);
//       }
//     }

//     if (type === "update" && inspectionId) {
//       fetchInspection();
//     }
//   }, [type, inspectionId, form]);

// const onSubmit = async (data: InspectionFormSchemaProps) => {
//   if (!inspectionId) return;

//   try {
//     const startDateObj = new Date(data.date);
//     const [sh, sm] = data.time.split(":").map(Number);
//     startDateObj.setHours(sh, sm);

//     const formattedDate = startDateObj.toISOString().replace("Z", " +0100");

//     const payload = {
//       id: inspectionId,
//       data: {
//         title: data.title,
//         description: data.description || "Be early!",
//         start: formattedDate,
//         duration: [1, "hour"] as [number, string], // Default duration
//       },
//     };

//     const result = await inspection({
//       type: type,
//       payload: payload,
//     });

//     if (!result) throw new Error("Failed to create inspection");

//     toast.success("Inspection created");
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Unexpected error";
//     toast.error(message);
//     console.error(error);
//   }
// };

//   return (
//     <Sheet>
//       <SheetTrigger asChild>{children}</SheetTrigger>
//       <SheetContent>
//         {isFetchingInspection ? (
//           <div className="flex h-full items-center justify-center">
//             <Loader className="size-5 animate-spin" />
//             <span className="ml-2">Loading inspection data...</span>
//           </div>
//         ) : (
//           <Form {...form}>
// <form
//   onSubmit={form.handleSubmit(onSubmit)}
//   className="flex h-full flex-col"
// >
// <SheetHeader>
//   <SheetTitle className="font-sans">
//     {type === "update"
//       ? "Update Inspection"
//       : "Create Inspection"}
//   </SheetTitle>
//   <SheetDescription>
//     {type === "update"
//       ? "Modify the inspection details below."
//       : "Schedule a new inspection by filling out the form below."}
//   </SheetDescription>
// </SheetHeader>

//               <Separator className="my-6" />

//               <div className="flex-1 overflow-y-auto">
//                 <div className="flex flex-col gap-6">
// <FormField
//   control={form.control}
//   name="title"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Title</FormLabel>
//       <FormControl>
//         <Input placeholder="Inspection title" {...field} />
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl>
//                           <Textarea
//                             placeholder="Add details about the inspection"
//                             {...field}
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="grid grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="date"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col">
//                           <FormLabel>Start Date</FormLabel>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <FormControl>
//                                 <div
//                                   className={cn(
//                                     "flex h-14 w-full items-center rounded-xl border px-4 text-left font-normal",
//                                     !field.value && "text-muted-foreground",
//                                   )}
//                                 >
//                                   {field.value ? (
//                                     format(field.value, "PPP")
//                                   ) : (
//                                     <span>Pick a date</span>
//                                   )}
//                                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                 </div>
//                               </FormControl>
//                             </PopoverTrigger>
//                             <PopoverContent
//                               className="w-auto p-0"
//                               align="start"
//                             >
//                               <Calendar
//                                 mode="single"
//                                 selected={field.value}
//                                 onSelect={field.onChange}
//                                 initialFocus
//                                 disabled={(date) => {
//                                   const today = new Date();
//                                   today.setHours(0, 0, 0, 0);
//                                   return date < today;
//                                 }}
//                               />
//                             </PopoverContent>
//                           </Popover>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="time"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Start Time</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="time"
//                               placeholder="18:00"
//                               value={field.value || ""}
//                               onChange={field.onChange}
//                               onBlur={field.onBlur}
//                               name={field.name}
//                               ref={field.ref}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               </div>

// <SheetFooter className="pt-6">
//   {type === "update" && (
//     <SheetClose asChild>
//       <Button
//         type="button"
//         variant="outline"
//         disabled={isSubmitting}
//       >
//         Cancel
//       </Button>
//     </SheetClose>
//   )}
//   <Button type="submit" disabled={isSubmitting}>
//     {isSubmitting
//       ? type === "update"
//         ? "Updating..."
//         : "Creating..."
//       : type === "update"
//         ? "Update Inspection"
//         : "Create Inspection"}
//   </Button>
// </SheetFooter>
//             </form>
//           </Form>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default InspectionForm;
