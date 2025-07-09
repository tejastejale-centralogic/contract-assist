import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      toast({
        title: "PDF uploaded successfully",
        description: `File: ${file.name}`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
    }
  };

  const handleProcess = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing information",
        description: "Please upload a PDF and select document type.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing completed",
        description: `${selectedFile.name} has been processed as ${documentType}.`,
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Upload and process your PDF documents</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PDF Upload Section */}
          <div className="space-y-2">
            <label htmlFor="pdf-upload" className="text-sm font-medium">
              Upload PDF Document
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF files only</p>
              </label>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
            )}
          </div>

          {/* Document Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Process Button */}
          <Button 
            onClick={handleProcess} 
            disabled={!selectedFile || !documentType || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Process Document"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;