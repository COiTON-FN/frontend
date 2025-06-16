import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Country, State } from "country-state-city";

interface CountryData {
  name: string;
  isoCode: string;
  flag: string;
  latitude: string;
  longitude: string;
}

interface StateData {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
}

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CountryData | null) => void;
  onStateChange?: (state: StateData | null) => void;
  error?: boolean;
}

const getCountries = (): CountryData[] => {
  return Country.getAllCountries().map((c) => ({
    name: c.name,
    isoCode: c.isoCode,
    flag: c.flag,
    latitude: c.latitude,
    longitude: c.longitude,
  }));
};

const getStatesByCountry = (countryCode: string): StateData[] => {
  return State.getStatesOfCountry(countryCode).map((s) => ({
    name: s.name,
    isoCode: s.isoCode,
    countryCode: s.countryCode,
    latitude: s.latitude ?? "",
    longitude: s.longitude ?? "",
  }));
};

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
  error,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  const countriesData = useMemo(() => getCountries(), []);
  const statesData = useMemo(
    () => (selectedCountry ? getStatesByCountry(selectedCountry.isoCode) : []),
    [selectedCountry],
  );

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedState(null);
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state: StateData) => {
    setSelectedState(state);
    onStateChange?.(state);
  };

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger disabled={disabled} asChild>
          <div
            aria-expanded={openCountryDropdown}
            role="combobox"
            className={cn(
              "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-[15px]",
              {
                "border-destructive focus-visible:ring-destructive": error,
              },
            )}
          >
            {selectedCountry ? (
              <span>{selectedCountry.name}</span>
            ) : (
              <span>Select Country...</span>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput disabled={disabled} placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-max max-h-[250px] overflow-y-auto">
                  {countriesData.map((country) => (
                    <CommandItem
                      key={country.isoCode}
                      value={country.name}
                      onSelect={() => {
                        handleCountrySelect(country);
                        setOpenCountryDropdown(false);
                      }}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.isoCode === country.isoCode
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector */}
      {statesData.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger disabled={disabled} asChild>
            <div
              aria-expanded={openStateDropdown}
              role="combobox"
              className={cn(
                "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-[15px]",
                {
                  "border-destructive focus-visible:ring-destructive": error,
                  "pointer-events-none opacity-80": !selectedCountry,
                },
              )}
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput disabled={disabled} placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-max max-h-[250px] overflow-y-auto">
                    {statesData.map((state) => (
                      <CommandItem
                        key={state.isoCode}
                        value={state.name}
                        onSelect={() => {
                          handleStateSelect(state);
                          setOpenStateDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{state.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedState?.isoCode === state.isoCode
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelector;
