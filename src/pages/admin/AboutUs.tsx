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
import { useToast } from "@/hooks/use-toast";
import { aboutUsApi, AboutUs } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AboutUsPage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [aboutUsContent, setAboutUsContent] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("en");

  const [formData, setFormData] = useState({
    mission_ar: "",
    mission_en: "",
    vision_ar: "",
    vision_en: "",
    desc_en: "",
    desc_ar: "",
    img: null as File | null,
  });

  // Fetch about us content on component mount
  useEffect(() => {
    fetchAboutUs();
  }, []);

  // Update active tab when language changes
  useEffect(() => {
    setActiveTab(language);
  }, [language]);

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const response = await aboutUsApi.getAboutUs();
      setAboutUsContent(response.data);
      // Set initial tab based on current language
      setActiveTab(language);
    } catch (error) {
      console.error("Error fetching about us:", error);
      toast({
        title: t("error"),
        description: "Failed to load about us content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.mission_ar ||
      !formData.mission_en ||
      !formData.vision_ar ||
      !formData.vision_en
    ) {
      toast({
        title: t("error"),
        description:
          "Please fill in mission and vision fields in both languages",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("mission_ar", formData.mission_ar);
      formDataToSend.append("mission_en", formData.mission_en);
      formDataToSend.append("vision_ar", formData.vision_ar);
      formDataToSend.append("vision_en", formData.vision_en);
      formDataToSend.append("desc_en", formData.desc_en);
      formDataToSend.append("desc_ar", formData.desc_ar);

      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }

      if (aboutUsContent?.id) {
        // Update existing content
        await aboutUsApi.updateAboutUs(aboutUsContent.id, formDataToSend);
        toast({
          title: t("success"),
          description: "About Us content updated successfully",
        });
      } else {
        // Create new content
        await aboutUsApi.createAboutUs(formDataToSend);
        toast({
          title: t("success"),
          description: "About Us content created successfully",
        });
      }

      // Refresh about us content
      await fetchAboutUs();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving about us:", error);
      toast({
        title: t("error"),
        description: "Failed to save about us content",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    if (aboutUsContent) {
      setFormData({
        mission_ar: aboutUsContent.mission_ar || "",
        mission_en: aboutUsContent.mission_en || "",
        vision_ar: aboutUsContent.vision_ar || "",
        vision_en: aboutUsContent.vision_en || "",
        desc_en: aboutUsContent.desc_en || "",
        desc_ar: aboutUsContent.desc_ar || "",
        img: null,
      });
    } else {
      // If no content exists, start with empty form
      setFormData({
        mission_ar: "",
        mission_en: "",
        vision_ar: "",
        vision_en: "",
        desc_en: "",
        desc_ar: "",
        img: null,
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    if (aboutUsContent) {
      setFormData({
        mission_ar: aboutUsContent.mission_ar || "",
        mission_en: aboutUsContent.mission_en || "",
        vision_ar: aboutUsContent.vision_ar || "",
        vision_en: aboutUsContent.vision_en || "",
        desc_en: aboutUsContent.desc_en || "",
        desc_ar: aboutUsContent.desc_ar || "",
        img: null,
      });
    } else {
      setFormData({
        mission_ar: "",
        mission_en: "",
        vision_ar: "",
        vision_en: "",
        desc_en: "",
        desc_ar: "",
        img: null,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Loading about us content...</span>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">{t("aboutUs")}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's mission, vision and about us content
          </p>
        </div>

        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Edit className="w-4 h-4 mr-2" />
            {aboutUsContent ? t("edit") : t("create")} {t("aboutUs")}
          </Button>
        ) : (
          <div className={cn("flex gap-2", isRTL ? "flex-row-reverse" : "")}>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Button>
            <Button
              form="about-us-form"
              type="submit"
              className="bg-gradient-primary hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {t("save")}
            </Button>
          </div>
        )}
      </div>

      {/* Content Display/Edit */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>
            {isEditing
              ? `${aboutUsContent ? t("edit") : t("create")} ${t("aboutUs")}`
              : t("aboutUs")}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? aboutUsContent
                ? "Update your company's mission, vision and about us content"
                : "Create your company's mission, vision and about us content"
              : aboutUsContent
              ? "View your company's mission, vision and about us content"
              : "No content available. Click edit to create your about us content."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form
              id="about-us-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission_en">Mission (English) *</Label>
                    <Input
                      id="mission_en"
                      value={formData.mission_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mission_en: e.target.value,
                        }))
                      }
                      placeholder="Enter company mission in English"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision_en">Vision (English) *</Label>
                    <Input
                      id="vision_en"
                      value={formData.vision_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vision_en: e.target.value,
                        }))
                      }
                      placeholder="Enter company vision in English"
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
                    <Label htmlFor="mission_ar" className="text-right block">
                      Mission (العربية) *
                    </Label>
                    <Input
                      id="mission_ar"
                      value={formData.mission_ar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mission_ar: e.target.value,
                        }))
                      }
                      placeholder="أدخل رسالة الشركة بالعربية"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision_ar" className="text-right block">
                      Vision (العربية) *
                    </Label>
                    <Input
                      id="vision_ar"
                      value={formData.vision_ar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vision_ar: e.target.value,
                        }))
                      }
                      placeholder="أدخل رؤية الشركة بالعربية"
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
            </form>
          ) : aboutUsContent ? (
            <div className="space-y-6">
              {/* Image Display */}
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {aboutUsContent.img ? (
                    <img
                      src={aboutUsContent.img}
                      alt="About Us"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Content Display */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mission
                    </Label>
                    <p className="text-lg font-semibold">
                      {aboutUsContent?.mission_en || "No mission set"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Vision
                    </Label>
                    <p className="text-lg font-semibold">
                      {aboutUsContent?.vision_en || "No vision set"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Description
                    </Label>
                    <p className="text-base leading-relaxed">
                      {aboutUsContent?.desc_en || "No description set"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4 mt-4" dir="rtl">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground text-right block">
                      الرسالة
                    </Label>
                    <p className="text-lg font-semibold text-right">
                      {aboutUsContent?.mission_ar || "لم يتم تحديد رسالة"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground text-right block">
                      الرؤية
                    </Label>
                    <p className="text-lg font-semibold text-right">
                      {aboutUsContent?.vision_ar || "لم يتم تحديد رؤية"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground text-right block">
                      الوصف
                    </Label>
                    <p className="text-base leading-relaxed text-right">
                      {aboutUsContent?.desc_ar || "لم يتم تحديد وصف"}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Content Available
              </h3>
              <p className="text-muted-foreground">
                Click the edit button to create your about us content.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsPage;
