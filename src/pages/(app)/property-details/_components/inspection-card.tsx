import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { variables } from "@/utils/variables";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { toast } from "sonner";
import { google, ics, office365, outlook, yahoo } from "calendar-link";
import { SiGooglecalendar } from "react-icons/si";
import { CgMicrosoft } from "react-icons/cg";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { FaYahoo } from "react-icons/fa6";
import { ImAppleinc } from "react-icons/im";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import InspectionForm from "@/components/shared/inspection-form";

interface InspectionCardProps {
  isOwner: boolean;
  ownerAddress: string;
  location: string;
}

export interface InspectionDataProps {
  success: boolean;
  message: string;
  data?: {
    data: {
      title: string;
      description: string;
      start: string;
      end: string;
      location: string;
      duration: [1, "hour"];
    };
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface InspectionPayload {
  id?: string;
  data: {
    title: string;
    description: string;
    start: string;
    end?: string;
    location?: string;
    duration: [number, string];
  };
}

const InspectionCard: FC<InspectionCardProps> = ({
  isOwner,
  ownerAddress,
  location,
}) => {
  const [inspectionData, setInspectionData] = useState<
    InspectionDataProps["data"] | null
  >(null);
  const [isFetchingInspection, setIsFetchingInspection] =
    useState<boolean>(false);
  const [isDeletingInspection, setIsDeletingInspection] =
    useState<boolean>(false);
  const [isCreatingInspection, setIsCreatingInspection] =
    useState<boolean>(false);
  const [isUpdatingInspection, setIsUpdatingInspection] =
    useState<boolean>(false);
  const [calendarLinks, setCalendarLinks] = useState<
    { label: string; url: string; icon: IconType }[]
  >([]);

  const handleFetchInspection = useCallback(async () => {
    if (!ownerAddress) return;
    try {
      setIsFetchingInspection(true);
      const response = await fetch(
        `${variables.renderEndpoint}/inspection/${ownerAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result: InspectionDataProps = await response.json();
      if (!result.data) return;
      if (!result.success && !result.data) {
        throw new Error(result.message);
      }

      const startDate = result.data.data.start.replace(" +0100", "+01:00");
      const endDate = result.data.data.end
        ? result.data.data.end.replace(" +0100", "+01:00")
        : startDate;

      const refinedResponse = {
        ...result.data,
        data: {
          ...result.data.data,
          start: startDate,
          end: endDate,
        },
      };

      setInspectionData(refinedResponse);
      setCalendarLinks([
        {
          label: "Google Calendar",
          url: google(refinedResponse.data),
          icon: SiGooglecalendar,
        },
        {
          label: "Apple (ICS)",
          url: ics(refinedResponse.data),
          icon: ImAppleinc,
        },
        {
          label: "Office365",
          url: office365(refinedResponse.data),
          icon: CgMicrosoft,
        },
        {
          label: "Outlook",
          url: outlook(refinedResponse.data),
          icon: PiMicrosoftOutlookLogo,
        },
        { label: "Yahoo", url: yahoo(refinedResponse.data), icon: FaYahoo },
      ]);
    } catch (error) {
      console.error("Error fetching inspection:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : "Error fetching the inspection.",
      );
    } finally {
      setIsFetchingInspection(false);
    }
  }, [ownerAddress]);

  const handleCreateInspection = async (payload: InspectionPayload) => {
    if (!ownerAddress || !isOwner) return;

    try {
      setIsCreatingInspection(true);
      const response = await fetch(`${variables.renderEndpoint}/inspection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: InspectionDataProps = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      await handleFetchInspection();
      toast.success(result.message || "Inspection created successfully.");
      return result;
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : "Error creating the inspection.",
      );
    } finally {
      setIsCreatingInspection(false);
    }
  };

  const handleUpdateInspection = async (payload: InspectionPayload) => {
    if (!ownerAddress || !isOwner) return;

    try {
      setIsUpdatingInspection(true);
      const response = await fetch(
        `${variables.renderEndpoint}/inspection/${ownerAddress}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result: InspectionDataProps = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      await handleFetchInspection();
      toast.success(result.message || "Inspection updated successfully.");
    } catch (error) {
      console.error("Error updating inspection:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : "Error updating the inspection.",
      );
    } finally {
      setIsUpdatingInspection(false);
    }
  };

  const handleDeleteInspection = async () => {
    if (!ownerAddress || !isOwner) return;

    try {
      setIsDeletingInspection(true);
      const response = await fetch(
        `${variables.renderEndpoint}/inspection/${ownerAddress}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result: InspectionDataProps = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      setInspectionData(result?.data || null);
      await handleFetchInspection();
      toast.success(result.message || "Inspection deleted successfully.");
    } catch (error) {
      console.error("Error deleting inspection:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : "Error deleting the inspection.",
      );
    } finally {
      setIsDeletingInspection(false);
    }
  };

  useEffect(() => {
    handleFetchInspection();
  }, [handleFetchInspection, ownerAddress]);

  if (isFetchingInspection)
    return <Skeleton className="aspect-video flex-1 rounded-2xl border" />;

  if (!inspectionData && !isOwner)
    return (
      <div className="flex aspect-video flex-1 flex-col items-center justify-center gap-16 rounded-2xl border p-6 sm:p-8">
        <p className="text-base font-normal text-muted-foreground">
          No Inspection Scheduled.
        </p>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col gap-10 rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-7">
        <p className="text-xl font-medium">
          {inspectionData?.data?.title ?? "Inspection Schedule"}
        </p>
        <div className="flex flex-col">
          <p className="text-muted-foreground">
            {inspectionData?.data?.description ??
              "Set a scheduled inspection time for prospective viewings."}
          </p>
          <p className="mt-1 text-lg font-medium capitalize text-primary sm:text-xl">
            {inspectionData?.data?.start && inspectionData?.data?.end
              ? `${format(new Date(inspectionData?.data?.start), "MMM dd yyyy, HH:mm")} - ${format(new Date(inspectionData?.data?.end), "MMM dd yyyy, HH:mm")}`
              : "This is optional and can be configured later."}
          </p>

          <p className="mt-4 text-muted-foreground">
            {inspectionData?.data?.location ??
              "You may either choose a place right away or let it utilize the property location."}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isOwner ? (
          <Fragment>
            {inspectionData?.data ? (
              <InspectionForm
                type="update"
                location={location}
                inspectionId={ownerAddress}
                inspectionData={inspectionData}
                handleUpdateInspection={handleUpdateInspection}
              >
                <Button
                  size="lg"
                  disabled={isDeletingInspection || isUpdatingInspection}
                  isLoading={isUpdatingInspection}
                  txt="Updating inspection..."
                  className="flex-1 rounded-full"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.89453 11.654C4.89453 7.56846 4.89453 5.52572 6.16373 4.25651C7.43294 2.9873 9.47569 2.9873 13.5612 2.9873H15.1862C19.2717 2.9873 21.3145 2.9873 22.5836 4.25651C23.8529 5.52572 23.8529 7.56846 23.8529 11.654V15.9873C23.8529 20.0728 23.8529 22.1156 22.5836 23.3847C21.3145 24.654 19.2717 24.654 15.1862 24.654H13.5612C9.47569 24.654 7.43294 24.654 6.16373 23.3847C4.89453 22.1156 4.89453 20.0728 4.89453 15.9873V11.654Z"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.1771 13.7923C10.715 12.9864 10.4918 12.3283 10.3573 11.6612C10.1583 10.6748 10.6137 9.71108 11.3681 9.09618C11.687 8.8363 12.0525 8.92509 12.241 9.26336L12.6667 10.027C13.0041 10.6323 13.1728 10.935 13.1393 11.2559C13.1059 11.5767 12.8784 11.838 12.4234 12.3607L11.1771 13.7923ZM11.1771 13.7923C12.1126 15.4233 13.5806 16.8922 15.2136 17.8288M15.2136 17.8288C16.0195 18.2909 16.6775 18.5141 17.3446 18.6486C18.3311 18.8476 19.2947 18.3922 19.9096 17.6378C20.1695 17.3188 20.0808 16.9533 19.7425 16.7648L18.9788 16.3392C18.3735 16.0017 18.0709 15.833 17.75 15.8665C17.4291 15.9 17.1678 16.1275 16.6451 16.5825L15.2136 17.8288Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.97786 7.32031H3.26953M5.97786 13.8203H3.26953M5.97786 20.3203H3.26953"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Update Inspection</span>
                </Button>
              </InspectionForm>
            ) : (
              <InspectionForm
                type="create"
                location={location}
                inspectionId={ownerAddress}
                inspectionData={inspectionData}
                handleCreateInspection={handleCreateInspection}
              >
                <Button
                  size="lg"
                  disabled={isDeletingInspection || isCreatingInspection}
                  isLoading={isCreatingInspection || isUpdatingInspection}
                  txt="Creating inspection..."
                  className="flex-1 rounded-full"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.89453 11.654C4.89453 7.56846 4.89453 5.52572 6.16373 4.25651C7.43294 2.9873 9.47569 2.9873 13.5612 2.9873H15.1862C19.2717 2.9873 21.3145 2.9873 22.5836 4.25651C23.8529 5.52572 23.8529 7.56846 23.8529 11.654V15.9873C23.8529 20.0728 23.8529 22.1156 22.5836 23.3847C21.3145 24.654 19.2717 24.654 15.1862 24.654H13.5612C9.47569 24.654 7.43294 24.654 6.16373 23.3847C4.89453 22.1156 4.89453 20.0728 4.89453 15.9873V11.654Z"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.1771 13.7923C10.715 12.9864 10.4918 12.3283 10.3573 11.6612C10.1583 10.6748 10.6137 9.71108 11.3681 9.09618C11.687 8.8363 12.0525 8.92509 12.241 9.26336L12.6667 10.027C13.0041 10.6323 13.1728 10.935 13.1393 11.2559C13.1059 11.5767 12.8784 11.838 12.4234 12.3607L11.1771 13.7923ZM11.1771 13.7923C12.1126 15.4233 13.5806 16.8922 15.2136 17.8288M15.2136 17.8288C16.0195 18.2909 16.6775 18.5141 17.3446 18.6486C18.3311 18.8476 19.2947 18.3922 19.9096 17.6378C20.1695 17.3188 20.0808 16.9533 19.7425 16.7648L18.9788 16.3392C18.3735 16.0017 18.0709 15.833 17.75 15.8665C17.4291 15.9 17.1678 16.1275 16.6451 16.5825L15.2136 17.8288Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.97786 7.32031H3.26953M5.97786 13.8203H3.26953M5.97786 20.3203H3.26953"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Create Inspection</span>
                </Button>
              </InspectionForm>
            )}
            {inspectionData?.data && (
              <Button
                size="lg"
                variant="destructive"
                disabled={!inspectionData?.data || isDeletingInspection}
                isLoading={isDeletingInspection}
                txt="Please wait..."
                className="w-max rounded-full"
                onClick={handleDeleteInspection}
              >
                <span>Delete</span>
              </Button>
            )}
          </Fragment>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                disabled={isDeletingInspection || isUpdatingInspection}
                className="w-full rounded-full"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.89453 11.654C4.89453 7.56846 4.89453 5.52572 6.16373 4.25651C7.43294 2.9873 9.47569 2.9873 13.5612 2.9873H15.1862C19.2717 2.9873 21.3145 2.9873 22.5836 4.25651C23.8529 5.52572 23.8529 7.56846 23.8529 11.654V15.9873C23.8529 20.0728 23.8529 22.1156 22.5836 23.3847C21.3145 24.654 19.2717 24.654 15.1862 24.654H13.5612C9.47569 24.654 7.43294 24.654 6.16373 23.3847C4.89453 22.1156 4.89453 20.0728 4.89453 15.9873V11.654Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.1771 13.7923C10.715 12.9864 10.4918 12.3283 10.3573 11.6612C10.1583 10.6748 10.6137 9.71108 11.3681 9.09618C11.687 8.8363 12.0525 8.92509 12.241 9.26336L12.6667 10.027C13.0041 10.6323 13.1728 10.935 13.1393 11.2559C13.1059 11.5767 12.8784 11.838 12.4234 12.3607L11.1771 13.7923ZM11.1771 13.7923C12.1126 15.4233 13.5806 16.8922 15.2136 17.8288M15.2136 17.8288C16.0195 18.2909 16.6775 18.5141 17.3446 18.6486C18.3311 18.8476 19.2947 18.3922 19.9096 17.6378C20.1695 17.3188 20.0808 16.9533 19.7425 16.7648L18.9788 16.3392C18.3735 16.0017 18.0709 15.833 17.75 15.8665C17.4291 15.9 17.1678 16.1275 16.6451 16.5825L15.2136 17.8288Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.97786 7.32031H3.26953M5.97786 13.8203H3.26953M5.97786 20.3203H3.26953"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Schedule Inspection</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              sideOffset={4}
              className="w-[320px] md:w-[420px]"
            >
              {calendarLinks.map((link, index) => (
                <Link
                  to={link.url}
                  target="_blank"
                  key={index}
                  className="w-full"
                >
                  <DropdownMenuItem className="gap-3">
                    <link.icon className="!size-5" />
                    <span>{link.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default InspectionCard;
