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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { projectsApi, categoriesApi, Project, Category } from "@/lib/api";
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProjectsPage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("en");

  const [formData, setFormData] = useState({
    category_id: "",
    title_en: "",
    title_ar: "",
    cover: null as File | null,
    images: [] as File[],
    video: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const title = language === "ar" ? project.title_ar : project.title_en;
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: t("error"),
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoriesApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: t("error"),
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_id || !formData.title_en || !formData.title_ar) {
      toast({
        title: t("error"),
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("title_en", formData.title_en);
      formDataToSend.append("title_ar", formData.title_ar);
      formDataToSend.append("video", formData.video);

      if (formData.cover) {
        formDataToSend.append("cover", formData.cover);
      }

      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[]`, image);
      });

      if (editingProject) {
        await projectsApi.updateProject(editingProject.id!, formDataToSend);
        toast({
          title: t("success"),
          description: "Project updated successfully",
        });
      } else {
        await projectsApi.createProject(formDataToSend);
        toast({
          title: t("success"),
          description: "Project created successfully",
        });
      }

      // Reset form and refresh data
      resetForm();
      setIsDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: t("error"),
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      category_id: project.category_id.toString(),
      title_en: project.title_en,
      title_ar: project.title_ar,
      cover: null,
      images: [],
      video: project.video || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await projectsApi.deleteProject(id);
      toast({
        title: t("success"),
        description: "Project deleted successfully",
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: t("error"),
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      category_id: "",
      title_en: "",
      title_ar: "",
      cover: null,
      images: [],
      video: "",
    });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover: file }));
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category
      ? language === "ar"
        ? category.name_ar
        : category.name_en
      : "Unknown";
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
            {t("ourProjects")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's projects and portfolios
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("add")} {t("ourProjects")}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject
                  ? `${t("edit")} ${t("ourProjects")}`
                  : `${t("add")} ${t("ourProjects")}`}
              </DialogTitle>
              <DialogDescription>
                Fill in the project information in both languages
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Loading categories..."
                          : "Select a category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading categories...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No categories available
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id!.toString()}
                        >
                          {language === "ar"
                            ? category.name_ar
                            : category.name_en}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_en">{t("title")} (English) *</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title_en: e.target.value,
                        }))
                      }
                      placeholder="Enter project title in English"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4 mt-4" dir="rtl">
                  <div className="space-y-2">
                    <Label htmlFor="title_ar" className="text-right block">
                      {t("title")} (العربية) *
                    </Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title_ar: e.target.value,
                        }))
                      }
                      placeholder="أدخل عنوان المشروع بالعربية"
                      className="text-right"
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="video">YouTube Video URL</Label>
                <Input
                  id="video"
                  value={formData.video}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      video: e.target.value,
                    }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    {t("upload")}
                  </Button>
                </div>
                {formData.cover && (
                  <div className="text-sm text-muted-foreground">
                    <div className="truncate">
                      Selected: {formData.cover.name}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      File size:{" "}
                      {(formData.cover.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}
                {editingProject?.cover && !formData.cover && (
                  <div className="text-sm text-muted-foreground">
                    <div className="text-xs text-muted-foreground/70">
                      Current cover image will be kept. Upload a new image to
                      replace it.
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div className="space-y-2">
                <Label htmlFor="images">Additional Images</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    {t("upload")}
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Selected {formData.images.length} image(s)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {editingProject?.images &&
                  editingProject.images.length > 0 &&
                  formData.images.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      <div className="text-xs text-muted-foreground/70">
                        Current images will be kept. Upload new images to add to
                        them.
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
                  {editingProject ? t("update") : t("create")}
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
                placeholder={`${t("search")} ${t("ourProjects")}...`}
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
            {t("ourProjects")} List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? `No projects found matching "${searchTerm}"`
                : "No projects found. Add your first project above."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (AR)</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Video</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      {project.cover ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={project.cover}
                            alt={project.title_en}
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
                    <TableCell>{project.title_en}</TableCell>
                    <TableCell>{project.title_ar}</TableCell>
                    <TableCell>
                      {getCategoryName(project.category_id)}
                    </TableCell>
                    <TableCell>
                      {project.video ? (
                        <a
                          href={project.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Video
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No video
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {project.images?.length || 0} images
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(project.updated_at!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
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
                                permanently delete the project.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id!)}
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

export default ProjectsPage;
