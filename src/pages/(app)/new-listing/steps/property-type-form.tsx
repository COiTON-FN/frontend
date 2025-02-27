import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dispatch, SetStateAction } from "react";
import { BiLandscape } from "react-icons/bi";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

export default function PropertyTypeForm({
  setSelectedType,
}: {
  setSelectedType: Dispatch<SetStateAction<"building" | "land" | null>>;
}) {
  const radios = [
    {
      title: "Buildings",
      description:
        "Choose this option if you want to list a building, such as an apartment or commercial structure.",
      icon: HiOutlineBuildingLibrary,
      value: "building",
    },
    {
      title: "Land",
      description:
        "Choose this option if you want to list a piece of land, such as a plot for sale or lease.",
      icon: BiLandscape,
      value: "land",
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <RadioGroup className="flex flex-col space-y-1">
        {radios.map((radio, index) => (
          <div
            onClick={() => setSelectedType(radio.value as "building" | "land")}
            key={index}
            className="w-full"
          >
            <Label className="relative flex w-full cursor-pointer items-center gap-6 rounded-xl border bg-background p-6">
              <span className="flex size-16 items-center justify-center rounded-full border bg-secondary">
                <radio.icon className="size-8 text-muted-foreground" />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-lg font-medium">{radio.title}</p>
                <span className="font-normal leading-4 tracking-wide text-muted-foreground">
                  {radio.description}
                </span>
              </div>

              <RadioGroupItem
                value={radio.value}
                className="absolute right-6 top-6 ml-auto"
              />
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
