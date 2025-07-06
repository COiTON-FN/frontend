"use client";

import * as React from "react";
import { Loader } from "lucide-react";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { cn, copyToClipboard } from "@/lib/utils";

interface ClipboardCopyProps {
  children?: React.ReactNode;
  value: string;
  className?: string;
  size?: number;
  message?: string;
}

export const ClipboardCopy: React.FC<ClipboardCopyProps> = ({
  children,
  value,
  className,
  size = 16,
  message,
}) => {
  const [isCopiedSuccessfully, setIsCopiedSuccessfully] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const selectableRef = React.useRef<HTMLSpanElement>(null);

  const handleCopyToClipboard = async (value: string) => {
    try {
      if (isCopying || isCopiedSuccessfully) return;

      setIsCopying(true);
      await copyToClipboard(value, message);

      if (selectableRef.current) {
        const range = document.createRange();
        range.selectNodeContents(selectableRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      setIsCopiedSuccessfully(true);
      setTimeout(() => {
        window.getSelection()?.removeAllRanges();
        setIsCopiedSuccessfully(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      onClick={() => handleCopyToClipboard(value)}
    >
      <span ref={selectableRef} className="truncate">
        {children}
      </span>

      {isCopying ? (
        <Loader size={size} className="animate-spin cursor-progress" />
      ) : isCopiedSuccessfully ? (
        <TbCopyCheckFilled
          size={size}
          className="cursor-not-allowed text-primary"
        />
      ) : (
        <TbCopy size={size} className="cursor-pointer" />
      )}
    </div>
  );
};
