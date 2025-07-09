import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Filter, Upload, X, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ContractDetails = () => {
  const { contractName } = useParams<{ contractName: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");

  const decodedContractName = decodeURIComponent(contractName || "");

  // Sample contract data for the specific company
  const contractDetails = [
    {
      contractId: "CT-001",
      name: decodedContractName,
      type: "PUBLIC",
      region: "North America",
      status: "Completed",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      value: "$150,000"
    },
    {
      contractId: "CT-002",
      name: decodedContractName,
      type: "PUBLIC", 
      region: "North America",
      status: "In Progress",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      value: "$200,000"
    }
  ];

  const documentTypes = [
    "Contract Agreement",
    "Amendment",
    "Invoice", 
    "Payment Receipt",
    "Legal Document",
    "Compliance Certificate",
    "Other"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">
            In Progress
          </Badge>
        );
      case "Not Started":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline" className="whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">{status}</Badge>;
    }
  };

  const filteredContracts = contractDetails.filter(contract =>
    contract.contractId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file only");
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFile && documentType) {
      // Handle upload logic here
      console.log("Uploading file:", selectedFile.name, "Type:", documentType);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentType("");
    } else {
      alert("Please select a file and document type");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{decodedContractName}</h1>
          <p className="text-muted-foreground">Contract Details and Documents</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground">Contract history and details</p>
        
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Contract Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="file">Upload PDF File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUploadSubmit} className="flex-1">
                    Upload
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUploadDialogOpen(false);
                      setSelectedFile(null);
                      setDocumentType("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{contract.contractId}</TableCell>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-black text-white">
                      {contract.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.region}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell className="font-medium">{contract.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ContractDetails;