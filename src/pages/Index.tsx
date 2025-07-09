import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Upload, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Document Processing System</h1>
          <p className="text-xl text-muted-foreground">
            Upload, process, and manage your PDF documents with ease
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="mt-4">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Easily upload your PDF documents with our intuitive drag-and-drop interface.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Categorize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select document types to ensure proper processing and organization.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Let our system automatically process your documents with advanced AI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
