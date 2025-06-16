import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IoClose } from "react-icons/io5";

const SPLITTER_REGEX = /[\n#?=&\t,./-]+/;
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g;

interface TagsInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
  error?: boolean;
}

interface TagsInputContextProps {
  value: string[];
  onValueChange: (value: any) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TagInputContext = React.createContext<TagsInputContextProps | null>(null);

export const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      error,
      value,
      onValueChange,
      placeholder,
      maxItems,
      minItems,
      className,
      dir,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const [inputValue, setInputValue] = React.useState("");
    const [disableInput, setDisableInput] = React.useState(false);
    const [disableButton, setDisableButton] = React.useState(false);
    const [isValueSelected, setIsValueSelected] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

    const parseMinItems = minItems ?? 0;
    const parseMaxItems = maxItems ?? Infinity;

    const onValueChangeHandler = React.useCallback(
      (val: string) => {
        if (!value?.includes(val) && (value?.length ?? 0) < parseMaxItems) {
          onValueChange([...(value ?? []), val]);
        }
      },
      [value, onValueChange, parseMaxItems],
    );

    const RemoveValue = React.useCallback(
      (val: string) => {
        if (value?.includes(val) && (value?.length ?? 0) > parseMinItems) {
          onValueChange(value.filter((item) => item !== val));
        }
      },
      [onValueChange, parseMinItems, value],
    );

    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const tags = e.clipboardData.getData("text").split(SPLITTER_REGEX);
        const newValue = [...(value ?? [])];
        tags.forEach((item) => {
          const parsedItem = item.replace(FORMATTING_REGEX, "").trim();
          if (
            parsedItem.length > 0 &&
            !newValue.includes(parsedItem) &&
            newValue.length < parseMaxItems
          ) {
            newValue.push(parsedItem);
          }
        });
        onValueChange(newValue);
        setInputValue("");
      },
      [onValueChange, parseMaxItems, value],
    );

    const handleSelect = React.useCallback(
      (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.preventDefault();
        const target = e.currentTarget;
        const selection = target.value.substring(
          target.selectionStart ?? 0,
          target.selectionEnd ?? 0,
        );

        setSelectedValue(selection);
        setIsValueSelected(selection === inputValue);
      },
      [inputValue],
    );

    React.useEffect(() => {
      const VerifyDisable = () => {
        if ((value?.length ?? 0) - 1 >= parseMinItems) {
          setDisableButton(false);
        } else {
          setDisableButton(true);
        }
        if ((value?.length ?? 0) + 1 <= parseMaxItems) {
          setDisableInput(false);
        } else {
          setDisableInput(true);
        }
      };
      VerifyDisable();
    }, [parseMaxItems, parseMinItems, value]);

    const handleKeyDown = React.useCallback(
      async (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const len = value?.length ?? 0;

        const moveNext = () => {
          const nextIndex = activeIndex + 1 > len - 1 ? -1 : activeIndex + 1;
          setActiveIndex(nextIndex);
        };

        const movePrev = () => {
          const prevIndex = activeIndex - 1 < 0 ? len - 1 : activeIndex - 1;
          setActiveIndex(prevIndex);
        };

        const moveCurrent = () => {
          const newIndex =
            activeIndex - 1 <= 0 ? (len - 1 === 0 ? -1 : 0) : activeIndex - 1;
          setActiveIndex(newIndex);
        };

        const target = e.currentTarget;

        switch (e.key) {
          case "ArrowLeft":
            if (dir === "rtl") {
              if (len > 0 && activeIndex !== -1) moveNext();
            } else {
              if (len > 0 && target.selectionStart === 0) movePrev();
            }
            break;

          case "ArrowRight":
            if (dir === "rtl") {
              if (len > 0 && target.selectionStart === 0) movePrev();
            } else {
              if (len > 0 && activeIndex !== -1) moveNext();
            }
            break;

          case "Backspace":
          case "Delete":
            if (len > 0) {
              if (activeIndex !== -1 && activeIndex < len) {
                RemoveValue(value![activeIndex]);
                moveCurrent();
              } else if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  RemoveValue(value![len - 1]);
                }
              }
            }
            break;

          case "Escape": {
            const newIndex = activeIndex === -1 ? len - 1 : -1;
            setActiveIndex(newIndex);
            break;
          }

          case "Enter":
            if (inputValue.trim() !== "") {
              e.preventDefault();
              onValueChangeHandler(inputValue);
              setInputValue("");
            }
            break;
        }
      },
      [
        activeIndex,
        value,
        dir,
        inputValue,
        RemoveValue,
        selectedValue,
        isValueSelected,
        onValueChangeHandler,
      ],
    );

    const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value);
      },
      [],
    );

    return (
      <TagInputContext.Provider
        value={{
          value,
          onValueChange,
          inputValue,
          setInputValue,
          activeIndex,
          setActiveIndex,
        }}
      >
        <div
          {...props}
          ref={ref}
          dir={dir}
          className={cn(
            "flex h-max min-h-14 w-full flex-wrap items-center gap-1 overflow-hidden rounded-lg border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl md:text-[15px]",
            {
              "focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:ring-offset-1":
                activeIndex === -1,
            },
            className,
            {
              "border-destructive focus-visible:ring-destructive": error,
            },
          )}
        >
          {(value ?? []).map((item, index) => (
            <Badge
              tabIndex={activeIndex !== -1 ? 0 : activeIndex}
              key={item}
              aria-disabled={disableButton}
              data-active={activeIndex === index}
              className={cn(
                "relative flex items-center gap-1 truncate rounded px-2 font-normal aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground",
              )}
              variant={"secondary"}
            >
              <span className="text-sm">{item}</span>
              <button
                type="button"
                aria-label={`Remove ${item} option`}
                aria-roledescription="button to remove option"
                disabled={disableButton}
                onMouseDown={mousePreventDefault}
                onClick={() => RemoveValue(item)}
                className="disabled:cursor-not-allowed"
              >
                <span className="sr-only">Remove {item} option</span>
                <IoClose className="size-4 hover:stroke-destructive" />
              </button>
            </Badge>
          ))}
          <Input
            tabIndex={0}
            aria-label="input tag"
            disabled={disableInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            value={inputValue}
            onSelect={handleSelect}
            onChange={activeIndex === -1 ? handleChange : undefined}
            placeholder={placeholder}
            onClick={() => setActiveIndex(-1)}
            className={cn(
              "h-max min-w-fit flex-1 border-none px-0 outline-none outline-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              activeIndex !== -1 && "caret-transparent",
            )}
          />
        </div>
      </TagInputContext.Provider>
    );
  },
);

TagsInput.displayName = "TagsInput";
