import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { whyChooseUsApi, WhyChooseUs } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Trash2, Loader2, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Available icons for selection
const availableIcons = [
  { value: "star", label: "⭐ Star" },
  { value: "heart", label: "❤️ Heart" },
  { value: "check", label: "✅ Check" },
  { value: "shield", label: "🛡️ Shield" },
  { value: "lightbulb", label: "💡 Lightbulb" },
  { value: "clock", label: "⏰ Clock" },
  { value: "users", label: "👥 Users" },
  { value: "award", label: "🏆 Award" },
  { value: "rocket", label: "🚀 Rocket" },
  { value: "gem", label: "💎 Gem" },
];

const WhyChooseUsPage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [whyChooseUsItems, setWhyChooseUsItems] = useState<WhyChooseUs[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WhyChooseUs | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("en");

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    desc_en: "",
    desc_ar: "",
    icon: "",
  });

  useEffect(() => {
    fetchWhyChooseUs();
  }, []);

  const filteredItems = whyChooseUsItems.filter((item) => {
    const name = language === "ar" ? item.name_ar : item.name_en;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchWhyChooseUs = async () => {
    try {
      setLoading(true);
      const response = await whyChooseUsApi.getWhyChooseUs();
      setWhyChooseUsItems(response.data);
    } catch (error) {
      console.error("Error fetching why choose us:", error);
      toast({
        title: t("error"),
        description: "Failed to load why choose us items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name_en ||
      !formData.name_ar ||
      !formData.desc_en ||
      !formData.desc_ar ||
      !formData.icon
    ) {
      toast({
        title: t("error"),
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name_en", formData.name_en);
      formDataToSend.append("name_ar", formData.name_ar);
      formDataToSend.append("desc_en", formData.desc_en);
      formDataToSend.append("desc_ar", formData.desc_ar);
      formDataToSend.append("icon", formData.icon);

      if (editingItem) {
        await whyChooseUsApi.updateWhyChooseUs(editingItem.id!, formDataToSend);
        toast({
          title: t("success"),
          description: "Why Choose Us item updated successfully",
        });
      } else {
        await whyChooseUsApi.createWhyChooseUs(formDataToSend);
        toast({
          title: t("success"),
          description: "Why Choose Us item created successfully",
        });
      }

      // Reset form and refresh data
      resetForm();
      setIsDialogOpen(false);
      fetchWhyChooseUs();
    } catch (error) {
      console.error("Error saving why choose us:", error);
      toast({
        title: t("error"),
        description: "Failed to save why choose us item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: WhyChooseUs) => {
    setEditingItem(item);
    setFormData({
      name_en: item.name_en,
      name_ar: item.name_ar,
      desc_en: item.desc_en,
      desc_ar: item.desc_ar,
      icon: item.icon,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await whyChooseUsApi.deleteWhyChooseUs(id);
      toast({
        title: t("success"),
        description: "Why Choose Us item deleted successfully",
      });
      fetchWhyChooseUs();
    } catch (error) {
      console.error("Error deleting why choose us:", error);
      toast({
        title: t("error"),
        description: "Failed to delete why choose us item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name_en: "",
      name_ar: "",
      desc_en: "",
      desc_ar: "",
      icon: "",
    });
  };

  const getIconDisplay = (iconValue: string) => {
    const icon = availableIcons.find((i) => i.value === iconValue);
    return icon ? icon.label : iconValue;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          isRTL ? "flex-row-reverse" : ""
        )}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("whyChooseUs")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's why choose us features
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("add")} {t("whyChooseUs")}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem
                  ? `${t("edit")} ${t("whyChooseUs")}`
                  : `${t("add")} ${t("whyChooseUs")}`}
              </DialogTitle>
              <DialogDescription>
                Fill in the why choose us information in both languages
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_en">{t("name")} (English) *</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name_en: e.target.value,
                        }))
                      }
                      placeholder="Enter name in English"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc_en">
                      {t("description")} (English)
                    </Label>
                    <Textarea
                      id="desc_en"
                      value={formData.desc_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desc_en: e.target.value,
                        }))
                      }
                      placeholder="Detailed description in English"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4 mt-4" dir="rtl">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar" className="text-right block">
                      {t("name")} (العربية) *
                    </Label>
                    <Input
                      id="name_ar"
                      value={formData.name_ar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name_ar: e.target.value,
                        }))
                      }
                      placeholder="أدخل الاسم بالعربية"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc_ar" className="text-right block">
                      {t("description")} (العربية)
                    </Label>
                    <Textarea
                      id="desc_ar"
                      value={formData.desc_ar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desc_ar: e.target.value,
                        }))
                      }
                      placeholder="وصف مفصل بالعربية"
                      className="text-right"
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Icon Selection */}
              <div className="space-y-2">
                <Label htmlFor="icon">Icon *</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className={cn(isRTL ? "flex-row-reverse" : "")}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {editingItem ? t("update") : t("create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="pt-6">
          <div
            className={cn(
              "flex items-center gap-4",
              isRTL ? "flex-row-reverse" : ""
            )}
          >
            <div className="flex-1 relative">
              <Search
                className={cn(
                  "absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground",
                  isRTL ? "right-3" : "left-3"
                )}
              />
              <Input
                placeholder={`${t("search")} ${t("whyChooseUs")}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t("filter")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">
            {t("whyChooseUs")} {t("list")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? `No items found matching "${searchTerm}"`
                : "No items found. Add your first 'Why Choose Us' item above."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Description (EN)</TableHead>
                  <TableHead>Description (AR)</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="text-2xl">
                        {getIconDisplay(item.icon)}
                      </span>
                    </TableCell>
                    <TableCell>{item.name_en}</TableCell>
                    <TableCell>{item.name_ar}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.desc_en}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.desc_ar}
                    </TableCell>
                    <TableCell>
                      {new Date(item.updated_at!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the why choose us item.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id!)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhyChooseUsPage;
