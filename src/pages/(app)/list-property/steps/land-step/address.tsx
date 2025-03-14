import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { landFormSchema, LandFormSchemaTypes } from "../../list-property.page";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setCurrentStep,
  updateFormData,
} from "@/store/slice/new-listing.slice";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CityData,
  cn,
  CountryData,
  getCitiesByState,
  getCountries,
  getStatesByCountry,
  StateData,
} from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { ArrowDown, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function AddressForm() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.newListing.formData);

  const [countryPopover, setCountryPopover] = useState(false);
  const [statePopover, setStatePopover] = useState(false);
  const [cityPopover, setCityPopover] = useState(false);

  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);

  const form = useForm<LandFormSchemaTypes>({
    resolver: zodResolver(
      landFormSchema.pick({
        region: true,
        zip: true,
        landmark: true,
        area: true,
        map: true
      }),
    ),
    defaultValues: {
      ...formData,
    },
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = (data: Partial<LandFormSchemaTypes>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(2));
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.countryCode === countryCode);
    if (country) {
      form.setValue("region.country", country);
      const newStates = getStatesByCountry(countryCode);
      setStates(newStates);
      setCities([]);
      form.setValue("region.state", {
        stateName: "",
        stateCode: "",
        countryCode: "",
        stateLat: 0,
        stateLong: 0,
      });
      form.setValue("region.city", {
        cityName: "",
        cityLat: 0,
        cityLong: 0,
        stateCode: "",
        countryCode: "",
      });
    }
  };

  const handleStateChange = (stateCode: string) => {
    const state = states.find((s) => s.stateCode === stateCode);
    if (state) {
      form.setValue("region.state", state);
      const newCities = getCitiesByState(state.countryCode, stateCode);
      setCities(newCities);
      form.setValue("region.city", {
        cityName: "",
        cityLat: 0,
        cityLong: 0,
        stateCode: "",
        countryCode: "",
      });
    }
  };

  const handleCityChange = (cityName: string) => {
    const city = cities.find((c) => c.cityName === cityName);
    if (city) {
      form.setValue("region.city", city);
    }
  };

  useEffect(() => {
    setCountries(getCountries());
  }, []);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="region.country"
          render={({ field }) => (
            <FormItem className="w-full">
              <Popover open={countryPopover} onOpenChange={setCountryPopover}>
                <FormControl className="w-full">
                  <PopoverTrigger className="w-full" asChild>
                    <div
                      aria-expanded={countryPopover}
                      role="combobox"
                      className={cn(
                        "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-base",
                        {
                          "border-red-500 focus-visible:ring-red-500":
                            errors.region?.country,
                        },
                      )}
                    >
                      {field.value?.countryName
                        ? countries.find(
                          (country) =>
                            country.countryName === field.value?.countryName,
                        )?.countryName
                        : "Select country..."}
                      <ChevronsUpDown className="size-4 opacity-50" />
                    </div>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-[480px] p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.countryCode}
                            value={country.countryName}
                            onSelect={() => {
                              form.setValue("region.country", country);
                              handleCountryChange(country.countryCode);
                              setCountryPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-1 size-4",
                                field.value?.countryName === country.countryName
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span className="mr-2 text-2xl">
                              {country.countryFlag}
                            </span>
                            {country.countryName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="region.state"
            render={({ field }) => (
              <FormItem className="w-full">
                <Popover open={statePopover} onOpenChange={setStatePopover}>
                  <FormControl className="w-full">
                    <PopoverTrigger className="w-full" asChild>
                      <div
                        aria-expanded={statePopover}
                        role="combobox"
                        className={cn(
                          "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-base",
                          {
                            "border-red-500 focus-visible:ring-red-500":
                              errors.region?.state,
                          },
                        )}
                      >
                        {field.value?.stateName
                          ? states.find(
                            (state) =>
                              state.stateName === field.value?.stateName,
                          )?.stateName
                          : "Select state..."}
                        <ChevronsUpDown className="size-4 opacity-50" />
                      </div>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-[480px] p-0">
                    <Command>
                      <CommandInput placeholder="Search state..." />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {states.map((state) => (
                            <CommandItem
                              key={state.stateCode}
                              value={state.stateName}
                              onSelect={() => {
                                form.setValue("region.state", state);
                                handleStateChange(state.stateCode);
                                setStatePopover(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-1 size-4",
                                  field.value?.stateName === state.stateName
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {state.stateName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region.city"
            render={({ field }) => (
              <FormItem className="w-full">
                <Popover open={cityPopover} onOpenChange={setCityPopover}>
                  <FormControl className="w-full">
                    <PopoverTrigger className="w-full" asChild>
                      <div
                        aria-expanded={cityPopover}
                        role="combobox"
                        className={cn(
                          "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-base",
                          {
                            "border-red-500 focus-visible:ring-red-500":
                              errors.region?.country,
                          },
                        )}
                      >
                        {field.value?.cityName
                          ? cities.find(
                            (city) => city.cityName === field.value?.cityName,
                          )?.cityName
                          : "Select city..."}
                        <ChevronsUpDown className="size-4 opacity-50" />
                      </div>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-[480px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              key={city.cityName}
                              value={city.cityName}
                              onSelect={() => {
                                form.setValue("region.city", city);
                                handleCityChange(city.cityName);
                                setCityPopover(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-1 size-4",
                                  field.value?.cityName === city.cityName
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {city.cityName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Area"
                  type="text"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.area?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.area && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.area?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="map"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Map"
                  type="text"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.map?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.map && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.map?.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="w-[30%]">
                <FormControl>
                  <Input
                    placeholder="Zip Code"
                    type="number"
                    className={cn("text-foreground", {
                      "border-red-500 focus-visible:ring-red-500":
                        errors.zip?.message,
                    })}
                    {...field}
                  />
                </FormControl>
                {errors.zip && (
                  <p
                    className={cn(
                      "text-sm font-medium text-red-500 dark:text-red-900",
                    )}
                  >
                    {errors.zip?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Nearest landmark"
                    type="text"
                    className={cn("text-foreground", {
                      "border-red-500 focus-visible:ring-red-500":
                        errors.landmark?.message,
                    })}
                    {...field}
                  />
                </FormControl>
                {errors.landmark && (
                  <p
                    className={cn(
                      "text-sm font-medium text-red-500 dark:text-red-900",
                    )}
                  >
                    {errors.landmark?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="my-6 h-px w-full" />

      <div className="flex w-full items-center gap-4">
        <Button type="submit" size={"lg"} className="flex-1 rounded-full">
          <span>Next</span>
          <ArrowDown className="size-5" />
        </Button>
      </div>
    </form>
  );
}
