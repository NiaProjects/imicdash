import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { servicesApi, Service } from "@/lib/api";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Search,
  Filter,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Services: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("en");

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    desc_en: "",
    desc_ar: "",
    img: null as File | null,
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.getServices();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: t("error"),
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const title = language === "ar" ? service.name_ar : service.name_en;
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en || !formData.name_ar) {
      toast({
        title: t("error"),
        description: "Please fill in all required fields",
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

      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }

      if (editingService) {
        await servicesApi.updateService(editingService.id!, formDataToSend);
        toast({
          title: t("success"),
          description: "Service updated successfully",
        });
      } else {
        await servicesApi.createService(formDataToSend);
        toast({
          title: t("success"),
          description: "Service created successfully",
        });
      }

      // Refresh services list
      await fetchServices();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: t("error"),
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name_en: service.name_en,
      name_ar: service.name_ar,
      desc_en: service.desc_en,
      desc_ar: service.desc_ar,
      img: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await servicesApi.deleteService(id);
      toast({
        title: t("success"),
        description: "Service deleted successfully",
      });
      // Refresh services list
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: t("error"),
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: "",
      name_ar: "",
      desc_en: "",
      desc_ar: "",
      img: null,
    });
    setEditingService(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
    }
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
            {t("services")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company services and offerings
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("add")} {t("services")}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService
                  ? `${t("edit")} ${t("services")}`
                  : `${t("add")} ${t("services")}`}
              </DialogTitle>
              <DialogDescription>
                Fill in the service information in both languages
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
                    <Label htmlFor="name_en">{t("title")} (English) *</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name_en: e.target.value,
                        }))
                      }
                      placeholder="Enter service title in English"
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
                      {t("title")} (العربية) *
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
                      placeholder="أدخل عنوان الخدمة بالعربية"
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="img">{t("image")}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="img"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    {t("upload")}
                  </Button>
                </div>
                {formData.img && (
                  <div className="text-sm text-muted-foreground">
                    <div className="truncate">
                      Selected: {formData.img.name}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      File size: {(formData.img.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </div>
                  </div>
                )}
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
                  {editingService ? t("update") : t("create")}
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
                placeholder={`${t("search")} ${t("services")}...`}
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

      {/* Services Table */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>{t("services")} List</CardTitle>
          <CardDescription>
            Manage and organize your service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn(isRTL ? "text-right" : "")}>
                  {t("image")}
                </TableHead>
                <TableHead className={cn(isRTL ? "text-right" : "")}>
                  {t("title")}
                </TableHead>
                <TableHead className={cn(isRTL ? "text-right" : "")}>
                  {t("description")}
                </TableHead>
                <TableHead className={cn(isRTL ? "text-right" : "")}>
                  Last Updated
                </TableHead>
                <TableHead className={cn(isRTL ? "text-right" : "")}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading services...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No services found. Create your first service to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        {service.img ? (
                          <img
                            src={service.img}
                            alt="Service"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">
                          {language === "ar"
                            ? service.name_ar
                            : service.name_en}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {service.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {language === "ar" ? service.desc_ar : service.desc_en}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {service.updated_at
                        ? new Date(service.updated_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          isRTL ? "flex-row-reverse" : ""
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Service
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this service?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(service.id!)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {t("delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
