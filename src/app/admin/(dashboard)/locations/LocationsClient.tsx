"use client";

import { useState } from "react";
import { 
  Plus, 
  Save, 
  Edit3, 
  Trash2, 
  MapPin, 
  Coins, 
  X,
  AlertTriangle 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from "@/actions/location.actions";

interface Location {
  id: string;
  name: string;
  avgPriceSqft: number;
}

interface LocationsClientProps {
  initialLocations: Location[];
}

export default function LocationsClient({ initialLocations }: LocationsClientProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [name, setName] = useState("");
  const [avgPriceSqft, setAvgPriceSqft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name.trim() || !avgPriceSqft || Number(avgPriceSqft) <= 0) {
      setError("Please fill out all fields with valid values.");
      setIsLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Edit Mode
        const res = await updateLocation(editingId, {
          name: name.trim(),
          avgPriceSqft: Number(avgPriceSqft),
        });

        if (res.success && res.location) {
          setLocations((prev) =>
            prev.map((loc) => (loc.id === editingId ? (res.location as Location) : loc))
          );
          resetForm();
        } else {
          setError(res.error || "Failed to update location.");
        }
      } else {
        // Create Mode
        const res = await createLocation({
          name: name.trim(),
          avgPriceSqft: Number(avgPriceSqft),
        });

        if (res.success && res.location) {
          setLocations((prev) => [...prev, res.location as Location]);
          resetForm();
        } else {
          setError(res.error || "Failed to create location.");
        }
      }
    } catch (err) {
      console.error("Location form error:", err);
      setError("Something went wrong. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (loc: Location) => {
    setError(null);
    setEditingId(loc.id);
    setName(loc.name);
    setAvgPriceSqft(loc.avgPriceSqft.toString());
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this location? This will also delete all properties listed in this location.")) {
      try {
        const res = await deleteLocation(id);
        if (res.success) {
          setLocations((prev) => prev.filter((loc) => loc.id !== id));
          if (editingId === id) resetForm();
        } else {
          alert(res.error || "Failed to delete location.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete location.");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setAvgPriceSqft("");
    setEditingId(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start select-none">
      
      {/* Left Column: Locations Table (Takes 2 Columns) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin size={18} className="text-gray-400" />
          <span>Active Pune Regions</span>
        </h2>

        <div className="liquid-glass border border-white/10 rounded-2xl overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="w-[50%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Location Name</TableHead>
                <TableHead className="w-[30%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Avg Price / Sqft</TableHead>
                <TableHead className="w-[20%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="text-center p-12 text-gray-500 font-light">
                    No locations set up yet.
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((loc) => (
                  <TableRow key={loc.id} className="border-b border-white/5 hover:bg-white/5 transition duration-200">
                    <TableCell className="p-4 font-semibold text-white">
                      {loc.name}
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="text-xs text-gray-300 font-light font-mono">
                        ₹{loc.avgPriceSqft.toLocaleString("en-IN")} / sqft
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(loc)}
                          className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id)}
                          className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Right Column: Form Panel (Takes 1 Column) */}
      <Card className="liquid-glass border-white/10 bg-transparent text-white shadow-lg backdrop-blur-md sticky top-24">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            {editingId ? <Edit3 size={14} /> : <Plus size={14} />}
            <span>{editingId ? "Edit Location" : "Add Location"}</span>
          </CardTitle>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-white transition cursor-pointer select-none"
              title="Cancel editing"
            >
              <X size={16} />
            </button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Error banner */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-3 py-2 rounded-lg flex items-start gap-1.5 animate-in fade-in duration-200">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Location Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                Region Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kothrud"
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full text-xs"
                />
              </div>
            </div>

            {/* Benchmark Price per sqft */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                Avg Price / Sqft (INR)
              </label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <Input
                  type="number"
                  required
                  value={avgPriceSqft}
                  onChange={(e) => setAvgPriceSqft(e.target.value)}
                  placeholder="e.g. 8500"
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full text-xs font-mono"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center gap-2 mt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-white/5 border border-white/5 text-gray-300 py-2 rounded-lg text-xs font-semibold hover:bg-white/10 transition active:scale-95 text-center cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-white text-black font-semibold text-xs h-9 rounded-lg hover:bg-gray-200 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save size={12} />
                <span>{isLoading ? "Saving..." : editingId ? "Update" : "Create"}</span>
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
