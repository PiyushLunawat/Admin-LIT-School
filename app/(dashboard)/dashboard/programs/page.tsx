"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import {
  createProgram,
  getPrograms,
  updateProgram,
  updateProgramStatus,
} from "@/app/api/programs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Program } from "@/types/dashboard/programs/programs";

export default function ProgramsPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [programLoading, setProgramLoading] = useState(false);
  const [newProgram, setNewProgram] = useState<Omit<Program, "_id" | "status">>(
    {
      name: "",
      description: "",
      duration: 0,
      prefix: "",
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      const programsData = await getPrograms();
      setPrograms(programsData.data);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const validateFields = () => {
    const duplicateName = programs.some(
      (program) =>
        program.name === newProgram.name && program._id !== selectedProgram
    );
    const duplicatePrefix = programs.some(
      (program) =>
        program.prefix === newProgram.prefix && program._id !== selectedProgram
    );

    const newErrors = {
      name: !newProgram.name
        ? "Program Name is required"
        : duplicateName
        ? "Program name already exists"
        : "",
      description: !newProgram.description ? "Description is required" : "",
      duration: newProgram.duration <= 0 ? "Duration is required" : "",
      prefix: !newProgram.prefix
        ? "Program Prefix is required"
        : duplicatePrefix
        ? "Program prefix already exists"
        : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleCreateOrUpdateProgram = async () => {
    setProgramLoading(true);
    try {
      if (editMode && selectedProgram) {
        if (!validateFields()) {
          return;
        }
        await updateProgram(selectedProgram, newProgram);
        toast({ title: "Program updated successfully!", variant: "success" });
      } else {
        if (!validateFields()) {
          return;
        }
        await createProgram(newProgram);
        toast({ title: "Program created successfully!", variant: "success" });
      }
      await fetchPrograms();
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Failed to create program",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProgramLoading(false);
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditMode(true);
    setSelectedProgram(program._id);
    setNewProgram({
      name: program.name,
      description: program.description,
      duration: program.duration,
      prefix: program.prefix,
    });
    setErrors({});
    setOpen(true);
  };

  const toggleProgramStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await updateProgramStatus(id, !currentStatus);
      toast({
        title: `Program successfully ${
          currentStatus ? "Disabled" : "Enabled"
        }!`,
        variant: "success",
      });
      await fetchPrograms();
    } catch (error) {
      console.error("Failed to update program status:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditMode(false);
              setSelectedProgram(null);
              setNewProgram({
                name: "",
                description: "",
                duration: 0,
                prefix: "",
              });
              setErrors({});
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditMode(false),
                  setNewProgram({
                    name: "",
                    description: "",
                    duration: 0,
                    prefix: "",
                  });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Program" : "Create New Program"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Creator Marketer"
                  value={newProgram.name}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief summary of the program"
                  value={newProgram.description}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      description: e.target.value,
                    })
                  }
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="6"
                    value={newProgram.duration || ""}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        duration: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm">{errors.duration}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefix">Program Prefix</Label>
                  <Input
                    id="prefix"
                    placeholder="e.g., CM"
                    className="uppercase"
                    value={newProgram.prefix}
                    onChange={(e) => {
                      const onlyAlphanumeric = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      setNewProgram((prev) => ({
                        ...prev,
                        prefix: onlyAlphanumeric,
                      }));
                    }}
                  />
                  {errors.prefix && (
                    <p className="text-red-500 text-sm">{errors.prefix}</p>
                  )}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleCreateOrUpdateProgram}
                disabled={programLoading}
              >
                {editMode
                  ? programLoading
                    ? "Updating..."
                    : "Update Program"
                  : programLoading
                  ? "Creating..."
                  : "Create Program"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground border-b border-t py-4 mx-16">
          <div className="flex justify-center items-center h-full">
            <LoaderCircle className="w-8 h-8 animate-spin" />
          </div>
        </div>
      ) : programs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow
                key={program._id}
                className={`${
                  program.status ? "text-white" : "text-muted-foreground"
                }`}
              >
                <TableCell>{program.name}</TableCell>
                <TableCell className="max-w-[500px]">
                  {program.description}
                </TableCell>
                <TableCell>{program.duration} months</TableCell>
                <TableCell>{program.prefix}</TableCell>
                <TableCell>{program.status ? "Active" : "Inactive"}</TableCell>
                <TableCell className="">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProgram(program)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            program.status
                              ? "text-destructive"
                              : "text-[#2EB88A]"
                          }
                        >
                          {program.status ? "Disable" : "Enable"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {" "}
                            {program.status ? "Disable" : "Enable"} Program
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {program.status ? "Disable" : "Enable"} this
                            Program?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className={`${
                              program.status
                                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                : ""
                            }`}
                            onClick={() =>
                              toggleProgramStatus(program._id, program.status)
                            }
                          >
                            {program.status ? "Disable" : "Enable"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground border-b border-t py-4 mx-16">
          No Programs Available
        </div>
      )}
    </div>
  );
}
