import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { clientsApi, Client } from "@/lib/api";
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
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Filter,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ClientsPage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("en");

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    img: null as File | null,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const name = language === "ar" ? client.name_ar : client.name_en;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsApi.getClients();
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: t("error"),
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en || !formData.name_ar) {
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
      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }

      if (editingClient) {
        await clientsApi.updateClient(editingClient.id!, formDataToSend);
        toast({
          title: t("success"),
          description: "Client updated successfully",
        });
      } else {
        await clientsApi.createClient(formDataToSend);
        toast({
          title: t("success"),
          description: "Client created successfully",
        });
      }

      // Reset form and refresh data
      resetForm();
      setIsDialogOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: t("error"),
        description: "Failed to save client",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name_en: client.name_en,
      name_ar: client.name_ar,
      img: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await clientsApi.deleteClient(id);
      toast({
        title: t("success"),
        description: "Client deleted successfully",
      });
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: t("error"),
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({
      name_en: "",
      name_ar: "",
      img: null,
    });
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
            {t("ourClients")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's clients and partners
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("add")} {t("ourClients")}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient
                  ? `${t("edit")} ${t("ourClients")}`
                  : `${t("add")} ${t("ourClients")}`}
              </DialogTitle>
              <DialogDescription>
                Fill in the client information in both languages
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
                      placeholder="Enter client name in English"
                      required
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
                      placeholder="أدخل اسم العميل بالعربية"
                      className="text-right"
                      required
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
                {editingClient?.img && !formData.img && (
                  <div className="text-sm text-muted-foreground">
                    <div className="text-xs text-muted-foreground/70">
                      Current image will be kept. Upload a new image to replace
                      it.
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
                  {editingClient ? t("update") : t("create")}
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
                placeholder={`${t("search")} ${t("ourClients")}...`}
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
            {t("ourClients")} {t("list")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? `No clients found matching "${searchTerm}"`
                : "No clients found. Add your first client above."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      {client.img ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={client.img}
                            alt={client.name_en}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                          <ImageIcon className="w-6 h-6 text-muted-foreground hidden" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{client.name_en}</TableCell>
                    <TableCell>{client.name_ar}</TableCell>
                    <TableCell>
                      {new Date(client.updated_at!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(client)}
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
                                permanently delete the client.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(client.id!)}
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

export default ClientsPage;
