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
import { newsApi, News } from "@/lib/api";
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
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NewsManagement: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("en");

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    body_en: "",
    body_ar: "",
    keyword_en: "",
    keyword_ar: "",
    content_en: "",
    content_ar: "",
    image: null as File | null,
  });

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsApi.getNews();
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: t("error"),
        description: "Failed to load news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter((item) => {
    const title = language === "ar" ? item.title_ar : item.title_en;
    const body = language === "ar" ? item.body_ar : item.body_en;
    const keyword = language === "ar" ? item.keyword_ar : item.keyword_en;
    const content = language === "ar" ? item.content_ar : item.content_en;
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title_en", formData.title_en);
      formDataToSend.append("title_ar", formData.title_ar);
      formDataToSend.append("body_en", formData.body_en);
      formDataToSend.append("body_ar", formData.body_ar);
      formDataToSend.append("keyword_en", formData.keyword_en);
      formDataToSend.append("keyword_ar", formData.keyword_ar);
      formDataToSend.append("content_en", formData.content_en);
      formDataToSend.append("content_ar", formData.content_ar);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingNews) {
        await newsApi.updateNews(editingNews.id!, formDataToSend);
        toast({
          title: t("success"),
          description: "News updated successfully",
        });
      } else {
        await newsApi.createNews(formDataToSend);
        toast({
          title: t("success"),
          description: "News created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      toast({
        title: t("error"),
        description: "Failed to save news",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title_en: newsItem.title_en,
      title_ar: newsItem.title_ar,
      body_en: newsItem.body_en,
      body_ar: newsItem.body_ar,
      keyword_en: newsItem.keyword_en || "",
      keyword_ar: newsItem.keyword_ar || "",
      content_en: newsItem.content_en || "",
      content_ar: newsItem.content_ar || "",
      image: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await newsApi.deleteNews(id);
      toast({
        title: t("success"),
        description: "News deleted successfully",
      });
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: t("error"),
        description: "Failed to delete news",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_ar: "",
      body_en: "",
      body_ar: "",
      keyword_en: "",
      keyword_ar: "",
      content_en: "",
      content_ar: "",
      image: null,
    });
    setEditingNews(null);
    setActiveTab("en");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("news")}</h1>
          <p className="text-muted-foreground">
            Manage your news articles and announcements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addNews")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? t("editNews") : t("addNews")}
              </DialogTitle>
              <DialogDescription>
                {editingNews
                  ? "Update the news article information below."
                  : "Add a new news article to your collection."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) =>
                        setFormData({ ...formData, title_en: e.target.value })
                      }
                      placeholder="Enter news title in English"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="keyword_en"
                      className="flex items-center gap-2"
                    >
                      Keywords (English)
                      <Badge variant="secondary" className="text-xs">
                        SEO
                      </Badge>
                    </Label>
                    <Input
                      id="keyword_en"
                      value={formData.keyword_en}
                      onChange={(e) =>
                        setFormData({ ...formData, keyword_en: e.target.value })
                      }
                      placeholder="Enter keywords in English (space separated)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="content_en"
                      className="flex items-center gap-2"
                    >
                      Content (English)
                      <Badge variant="secondary" className="text-xs">
                        SEO
                      </Badge>
                    </Label>
                    <Textarea
                      id="content_en"
                      value={formData.content_en}
                      onChange={(e) =>
                        setFormData({ ...formData, content_en: e.target.value })
                      }
                      placeholder="Enter detailed content in English"
                      rows={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body_en">Body (English)</Label>
                    <Textarea
                      id="body_en"
                      value={formData.body_en}
                      onChange={(e) =>
                        setFormData({ ...formData, body_en: e.target.value })
                      }
                      placeholder="Enter news body in English"
                      rows={4}
                      required
                    />
                  </div>
              
                </TabsContent>
                <TabsContent value="ar" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_ar">العنوان (العربية)</Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, title_ar: e.target.value })
                      }
                      placeholder="أدخل عنوان الخبر بالعربية"
                      required
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="keyword_ar"
                      className="flex items-center gap-2"
                    >
                      الكلمات المفتاحية (العربية)
                      <Badge variant="secondary" className="text-xs">
                        SEO
                      </Badge>
                    </Label>
                    <Input
                      id="keyword_ar"
                      value={formData.keyword_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, keyword_ar: e.target.value })
                      }
                      placeholder="أدخل الكلمات المفتاحية بالعربية (مفصولة بمسافة)"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y2">
                    <Label
                      htmlFor="content_ar"
                      className="flex items-center gap-2"
                    >
                      المحتوى التفصيلي (العربية)
                      <Badge variant="secondary" className="text-xs">
                        SEO
                      </Badge>
                    </Label>
                    <Textarea
                      id="content_ar"
                      value={formData.content_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, content_ar: e.target.value })
                      }
                      placeholder="أدخل المحتوى التفصيلي بالعربية"
                      rows={6}
                      required
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body_ar">النص الأساسي (العربية)</Label>
                    <Textarea
                      id="body_ar"
                      value={formData.body_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, body_ar: e.target.value })
                      }
                      placeholder="أدخل النص الأساسي للخبر بالعربية"
                      rows={4}
                      required
                      dir="rtl"
                    />
                  </div>

                </TabsContent>
              </Tabs>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">News Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {editingNews?.image && !formData.image && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Current image exists
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {editingNews ? t("update") : t("create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("search")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("searchNews")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              {t("filter")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("news")}</CardTitle>
          <CardDescription>
            A list of all news articles in your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead className="flex items-center gap-2">
                    Keywords
                    <Badge variant="secondary" className="text-xs">
                      SEO
                    </Badge>
                  </TableHead>
                  <TableHead>Body</TableHead>
                  <TableHead className="flex items-center gap-2">
                    Content
                    <Badge variant="secondary" className="text-xs">
                      SEO
                    </Badge>
                  </TableHead>
                  <TableHead>{t("createdAt")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {searchTerm
                        ? "No news found matching your search."
                        : "No news found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.image ? (
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={
                                language === "ar"
                                  ? item.title_ar
                                  : item.title_en
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {language === "ar" ? item.title_ar : item.title_en}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? item.title_en : item.title_ar}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="line-clamp-2 text-sm">
                            {language === "ar"
                              ? item.keyword_ar
                              : item.keyword_en}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="line-clamp-2">
                            {language === "ar" ? item.body_ar : item.body_en}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="line-clamp-2">
                            {language === "ar"
                              ? item.content_ar
                              : item.content_en}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {item.created_at && formatDate(item.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                                <AlertDialogTitle>
                                  {t("deleteNews")}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this news
                                  article? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {t("cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id!)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManagement;
