"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // In a real app, these would be fetched from an API
  const results = {
    cohorts: [
      { id: "CM01JY", name: "Creator Marketer - Morning Batch" },
      { id: "CM02JY", name: "Creator Marketer - Evening Batch" },
    ],
    programs: [
      { id: "1", name: "Creator Marketer" },
      { id: "2", name: "Digital Marketing" },
    ],
    centres: [
      { id: "1", name: "Jayanagar" },
      { id: "2", name: "Indiranagar" },
    ],
    students: [
      { id: "1", name: "John Doe", cohort: "CM01JY" },
      { id: "2", name: "Jane Smith", cohort: "CM02JY" },
    ],
  };

  const handleClear = () => {
    setQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search cohorts, programs, centres, or students..." 
          className="pl-8"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Cohorts">
                {results.cohorts.map((cohort) => (
                  <CommandItem
                    key={cohort.id}
                    onSelect={() => {
                      // Handle navigation
                      setShowResults(false);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{cohort.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({cohort.id})
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Programs">
                {results.programs.map((program) => (
                  <CommandItem
                    key={program.id}
                    onSelect={() => {
                      setShowResults(false);
                    }}
                  >
                    {program.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Centres">
                {results.centres.map((centre) => (
                  <CommandItem
                    key={centre.id}
                    onSelect={() => {
                      setShowResults(false);
                    }}
                  >
                    {centre.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Students">
                {results.students.map((student) => (
                  <CommandItem
                    key={student.id}
                    onSelect={() => {
                      setShowResults(false);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{student.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({student.cohort})
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}