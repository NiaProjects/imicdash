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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { contactMessagesApi, ContactMessage } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  User,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const ContactMessages: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactMessagesApi.getContactMessages();
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast({
        title: t("error"),
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchLower) ||
      message.email.toLowerCase().includes(searchLower) ||
      message.phone.toLowerCase().includes(searchLower) ||
      message.location.toLowerCase().includes(searchLower) ||
      message.type_unit.toLowerCase().includes(searchLower) ||
      message.msg.toLowerCase().includes(searchLower)
    );
  });

  const handleView = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await contactMessagesApi.deleteContactMessage(id);
      toast({
        title: t("success"),
        description: "Contact message deleted successfully",
      });
      fetchMessages();
    } catch (error) {
      console.error("Error deleting contact message:", error);
      toast({
        title: t("error"),
        description: "Failed to delete contact message",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading contact messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("contactMessages")}
          </h1>
          <p className="text-muted-foreground">
            View and manage customer contact messages
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </Badge>
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
                placeholder={t("searchMessages")}
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

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("contactMessages")}</CardTitle>
          <CardDescription>
            A list of all customer contact messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("typeUnit")}</TableHead>
                  <TableHead>{t("location")}</TableHead>
                  <TableHead>{t("createdAt")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchTerm
                        ? "No messages found matching your search."
                        : "No contact messages found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="font-medium">{message.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {message.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {message.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{message.type_unit}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="max-w-[150px] truncate">
                            {message.location}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.created_at && formatDate(message.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={isViewDialogOpen}
                            onOpenChange={setIsViewDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(message)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Contact Message Details
                                </DialogTitle>
                                <DialogDescription>
                                  View the complete contact message information.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedMessage && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-muted-foreground">
                                        Name
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          {selectedMessage.name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-muted-foreground">
                                        Email
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedMessage.email}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-muted-foreground">
                                        Phone
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedMessage.phone}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-muted-foreground">
                                        Type Unit
                                      </Label>
                                      <Badge variant="outline">
                                        {selectedMessage.type_unit}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Location
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedMessage.location}</span>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Message
                                    </Label>
                                    <div className="flex items-start gap-2">
                                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                                      <div className="bg-muted p-3 rounded-md">
                                        <p className="whitespace-pre-wrap">
                                          {selectedMessage.msg}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div className="text-sm text-muted-foreground">
                                    <div>
                                      Created:{" "}
                                      {selectedMessage.created_at &&
                                        formatDateTime(
                                          selectedMessage.created_at
                                        )}
                                    </div>
                                    {selectedMessage.updated_at && (
                                      <div>
                                        Updated:{" "}
                                        {formatDateTime(
                                          selectedMessage.updated_at
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t("deleteMessage")}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this contact
                                  message? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {t("cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(message.id!)}
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

export default ContactMessages;
