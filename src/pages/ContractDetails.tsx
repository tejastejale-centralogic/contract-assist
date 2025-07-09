import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Search, Filter, Upload, X, FileText, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContractApiService, type ProcessedContract } from "@/services/contractApi";

const ContractDetails = () => {
  const { contractName } = useParams<{ contractName: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [contracts, setContracts] = useState<ProcessedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewContract = (contractId: string) => {
    navigate(`/contract/${encodeURIComponent(contractName || "")}/view/${contractId}`);
  };

  const decodedContractName = decodeURIComponent(contractName || "");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const allContracts = await ContractApiService.fetchContracts();
        const companyContracts = ContractApiService.getContractsByCompany(allContracts, decodedContractName);
        setContracts(companyContracts);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [decodedContractName]);

  const documentTypes = [
    "MTF",
    "Legacy", 
    "PULA"
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

  const filteredContracts = contracts.filter(contract =>
    contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.filename.toLowerCase().includes(searchQuery.toLowerCase())
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
        <p className="text-muted-foreground">Contract history and details ({contracts.length} total)</p>
        
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
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Contract Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentType">Contract Type</Label>
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading contracts...
                  </TableCell>
                </TableRow>
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No contracts found for {decodedContractName}
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{contract.id}</TableCell>
                    <TableCell>{contract.filename}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-black text-white">
                        {contract.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{contract.region}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell>{new Date(contract.lastModified).toLocaleDateString()}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleViewContract(contract.id)}
                      >
                        <Eye className="h-4 w-4" />
                        {contract.status === "In Progress" ? "Process" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ContractDetails;