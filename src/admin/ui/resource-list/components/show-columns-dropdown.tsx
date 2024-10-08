import type { OptionModel } from "@/src/common/domain/models/option-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/common/ui/components/shadcn/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ShowColumnsDropdownProps {
  options: OptionModel[];
  value: string[];
  onChange: (value: string[]) => void;
}
export function ShowColumnsDropdown({
  options,
  value,
  onChange,
}: ShowColumnsDropdownProps) {
  const set = new Set(value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columnas <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => {
          const isChecked = set.has(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isChecked}
              onCheckedChange={(value) => {
                if (value) {
                  set.add(option.value);
                } else {
                  set.delete(option.value);
                }
                return onChange(Array.from(set));
              }}
              onSelect={(e) => e.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
