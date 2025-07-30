import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, ArrowRight, Palette } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <Card className="max-w-lg w-full mx-4 bg-gradient-card border-border/50 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary">
            <Palette className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Decor IMIC
          </CardTitle>
          <CardDescription className="text-lg">
            Professional Interior Design & Architecture
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Welcome to Your Website
            </h2>
            <p className="text-muted-foreground">
              Access the admin dashboard to manage your content, services, and
              portfolio.
            </p>
          </div>

          <Link to="/login" className="block">
            <Button className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow transition-all duration-300 group">
              <Settings className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Access Admin Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>

          <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border/50">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">
                Features Available
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Services & Portfolio Management</p>
                <p>• Bilingual Content (Arabic/English)</p>
                <p>• Client Testimonials & Messages</p>
                <p>• Project Gallery & News</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
