"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { getCentres, createCentre, updateCentre, updateCentreStatus } from "@/app/api/centres";
import { useDispatch, useSelector } from "react-redux";
import { getCentresData } from "@/lib/features/center/centerSlice";

interface Centre {
  _id: string;
  name: string;
  location: string;
  suffix: string;
  status: boolean;
}

export default function CentresPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [centerLoading, setCenterLoading] = useState(false);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [newCentre, setNewCentre] = useState<Omit<Centre, "_id" | "status">>({
    name: "",
    location: "",
    suffix: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const dispatch = useDispatch()
  
  const centerData = useSelector((state: any) => state.center.centers)

  const fetchCentres = async () => {
    try {
      const centresData = await getCentres();
      setCentres(centresData.data);
      dispatch(getCentresData(centresData.data));
    } catch (error: unknown) {
      console.error("Error fetching centres:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCentres(); // Initial load of centres
  }, []);

  const validateFields = () => {
    const duplicateName = centres.some(
      (centre) => centre.name === newCentre.name && centre._id !== selectedCentre
    );
    const duplicateSuffix = centres.some(
      (centre) => centre.suffix === newCentre.suffix && centre._id !== selectedCentre
    );

    const newErrors = {
      name: !newCentre.name
        ? "Field is required"
        : duplicateName
        ? "Centre name already exists"
        : "",
      location: !newCentre.location ? "Field is required" : "",
      suffix: !newCentre.suffix
        ? "Field is required"
        : duplicateSuffix
        ? "Centre suffix already exists"
        : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };



  const handleCreateOrUpdateCentre = async () => {
    setCenterLoading(true)
    try {
      if (editMode && selectedCentre) {
        if (!validateFields()) {
          toast({ title: "Please fix the errors", variant: "destructive" });
          return;
        }
        await updateCentre(selectedCentre, newCentre);
        toast({ title: "Centre updated successfully!", variant: "success" });
      } else {
        if (!validateFields()) {
          toast({ title: "Please fix the errors", variant: "destructive" });
          return;
        }
        await createCentre(newCentre);
        toast({ title: "Centre created successfully!", variant: "success" });
      }
      await fetchCentres();
      setOpen(false); // Close the dialog
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({ title: "Failed to save centre", description: errorMessage, variant: "destructive" });
    } finally {
      setCenterLoading(false)
    }
  };

  const handleEditCentre = (centre: Centre) => {
    setEditMode(true);
    setSelectedCentre(centre._id);
    setNewCentre({
      name: centre.name,
      location: centre.location,
      suffix: centre.suffix,
    });
    setErrors({});
    setOpen(true); // Open dialog in edit mode
  };

  const toggleCenterStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCentreStatus(id, !currentStatus);
      toast({ title: "Centre updated successfully!", variant: "success" });
      await fetchCentres();
    } catch (error) {
      console.error("Failed to update centre status:", error);
    }
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Centres</h1>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setEditMode(false);
            setSelectedCentre(null);
            setNewCentre({ name: "", location: "", suffix: "" });
            setErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditMode(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Centre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Centre" : "Create New Centre"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Centre Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Jayanagar Campus"
                  value={newCentre.name}
                  onChange={(e) => setNewCentre({ ...newCentre, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Bangalore"
                  value={newCentre.location}
                  onChange={(e) => setNewCentre({ ...newCentre, location: e.target.value })}
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">Centre Suffix</Label>
                <Input
                  id="suffix"
                  placeholder="e.g., JY"
                  className="uppercase"
                  value={newCentre.suffix}
                  onChange={(e) => setNewCentre({ ...newCentre, suffix: e.target.value.toUpperCase() })}
                />
                {errors.suffix && <p className="text-red-500 text-sm">{errors.suffix}</p>}
              </div>
              <Button className="w-full" onClick={handleCreateOrUpdateCentre}>
                {editMode ? 
                  centerLoading ? 'Updating...' : "Update Centre" : 
                  centerLoading ? 'Creating...' : "Create Centre"
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    
      {loading ? (
        <div className="text-center text-muted-foreground border-b border-t py-4 mx-16">Loading...</div>
      ) : centres.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Suffix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centerData.map((centre: Centre) => (
              <TableRow key={centre._id}>
                <TableCell>{centre.name}</TableCell>
                <TableCell>{centre.location}</TableCell>
                <TableCell>{centre.suffix}</TableCell>
                <TableCell>{centre.status ? "Active" : "Inactive"}</TableCell>
                <TableCell className="flex justify-start items-center">
                  <Button variant="ghost" size="icon" onClick={() => handleEditCentre(centre)}>
                    <SquarePen className="w-4 h-4"/>
                  </Button>
                  <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="sm" className={centre.status ? "text-destructive" : "text-[#2EB88A]"}>
                    {centre.status ? "Disable" : "Enable"}
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle> {centre.status ? "Disable" : "Enable"} Centre</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to  {centre.status ? "Disable" : "Enable"} this center?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className={`${centre.status ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}`} 
                    onClick={() => toggleCenterStatus(centre._id, centre.status)}>
                  {centre.status ? "Disable" : "Enable"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground border-b border-t py-4 mx-16">No Centres Available</div>
      )}
      <Toaster />
    </div>
  );
}
