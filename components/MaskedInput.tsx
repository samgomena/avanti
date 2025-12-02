import * as React from "react";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";

export interface MaskPattern {
  pattern: string;
  placeholder?: string;
  definitions?: Record<string, RegExp>;
}

export interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  mask: string | MaskPattern;
  value?: string;
  onChange?: (value: string, maskedValue: string) => void;
  showMask?: boolean;
}

const defaultDefinitions: Record<string, RegExp> = {
  "9": /\d/,
  a: /[a-zA-Z]/,
  "*": /[a-zA-Z0-9]/,
};

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    { className, mask, value = "", onChange, showMask = false, ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [cursorPos, setCursorPos] = React.useState<number | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const maskConfig: MaskPattern =
      typeof mask === "string"
        ? { pattern: mask, definitions: defaultDefinitions }
        : {
            ...mask,
            definitions: { ...defaultDefinitions, ...mask.definitions },
          };

    const {
      pattern,
      definitions = defaultDefinitions,
      placeholder,
    } = maskConfig;

    // Apply mask to raw value
    const applyMask = React.useCallback(
      (rawValue: string): string => {
        let maskedValue = "";
        let rawIndex = 0;

        for (let i = 0; i < pattern.length; i++) {
          if (rawIndex >= rawValue.length) {
            break;
          }

          const patternChar = pattern[i];
          const definition = definitions[patternChar];

          if (definition) {
            // This position expects user input
            const rawChar = rawValue[rawIndex];

            if (definition.test(rawChar)) {
              maskedValue += rawChar;
              rawIndex++;
            } else {
              // Invalid character, skip it and try next raw character
              rawIndex++;
              i--; // Stay at same pattern position
            }
          } else {
            // This is a literal character
            maskedValue += patternChar;
          }
        }

        return maskedValue;
      },
      [pattern, definitions]
    );

    // Extract raw value from any string (removes all non-matching characters)
    const extractRaw = React.useCallback(
      (inputValue: string): string => {
        let rawValue = "";

        for (let i = 0; i < inputValue.length; i++) {
          const char = inputValue[i];

          // Check if this character matches any definition
          const matchesDefinition = Object.values(definitions).some((regex) =>
            regex.test(char)
          );

          if (matchesDefinition) {
            rawValue += char;
          }
        }

        return rawValue;
      },
      [definitions]
    );

    const displayValue = React.useMemo(
      () => applyMask(value),
      [value, applyMask]
    );

    // Restore cursor position after render
    React.useEffect(() => {
      if (inputRef.current && cursorPos !== null) {
        inputRef.current.setSelectionRange(cursorPos, cursorPos);
        setCursorPos(null);
      }
    }, [cursorPos]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const currentCursorPos = e.target.selectionStart || 0;

      // Extract only valid characters
      const raw = extractRaw(inputValue);

      // Apply mask
      const masked = applyMask(raw);

      // Calculate new cursor position
      // Count how many valid chars are before cursor
      let validCharsBeforeCursor = 0;
      for (let i = 0; i < currentCursorPos && i < inputValue.length; i++) {
        const char = inputValue[i];
        const matchesDefinition = Object.values(definitions).some((regex) =>
          regex.test(char)
        );
        if (matchesDefinition) {
          validCharsBeforeCursor++;
        }
      }

      // Find position in masked value where we have that many valid chars
      let newCursorPos = 0;
      let validCharCount = 0;
      for (let i = 0; i < masked.length; i++) {
        if (validCharCount >= validCharsBeforeCursor) {
          break;
        }
        const patternChar = pattern[i];
        if (definitions[patternChar]) {
          validCharCount++;
        }
        newCursorPos++;
      }

      // Move cursor past any trailing literals
      while (
        newCursorPos < masked.length &&
        newCursorPos < pattern.length &&
        !definitions[pattern[newCursorPos]]
      ) {
        newCursorPos++;
      }

      setCursorPos(newCursorPos);

      if (onChange) {
        onChange(raw, masked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const cursorPosition = e.currentTarget.selectionStart || 0;

        // If cursor is right after a literal, move it back
        if (cursorPosition > 0 && !definitions[pattern[cursorPosition - 1]]) {
          e.preventDefault();

          // Find previous input position
          let newPos = cursorPosition - 1;
          while (newPos > 0 && !definitions[pattern[newPos - 1]]) {
            newPos--;
          }

          // Remove one character from raw value
          const raw = extractRaw(displayValue);
          const charsBeforePos = raw.length - 1;
          const newRaw = raw.slice(0, Math.max(0, charsBeforePos));
          const masked = applyMask(newRaw);

          setCursorPos(Math.max(0, newPos - 1));

          if (onChange) {
            onChange(newRaw, masked);
          }
        }
      }

      props.onKeyDown?.(e);
    };

    return (
      <input
        ref={inputRef}
        type="text"
        className={className}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || (showMask ? pattern : undefined)}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export default MaskedInput;
