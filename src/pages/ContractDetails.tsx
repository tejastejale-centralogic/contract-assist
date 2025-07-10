import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Search,
  Filter,
  Upload,
  X,
  FileText,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import loadingGif from "@/assets/loading.gif";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { contractApi, ContractFile } from "@/services/contractApi";
import { useToast } from "@/hooks/use-toast";

const ContractDetails = () => {
  const { contractName } = useParams<{ contractName: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [contracts, setContracts] = useState<ContractFile[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedContractName = decodeURIComponent(contractName || "");
  const uri = searchParams.get("uri") || "";

  useEffect(() => {
    const fetchContracts = async () => {
      console.log("object");
      // if (!uri) return;
      console.log("2");
      try {
        setLoading(true);
        const response = await contractApi.getContractFiles(uri);
        if (response.success) {
          setContracts(response.contracts);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch contract files",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [uri, toast]);

  const documentTypes = ["MTF", "Legacy", "PULA"];

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewContract = (contract: ContractFile) => {
    navigate(
      `/contract/${encodeURIComponent(
        contractName || ""
      )}/view/${encodeURIComponent(contract.filename)}?url=${encodeURIComponent(
        contract.url
      )}&uri=${encodeURIComponent(contract.uri)}&globalUri=${encodeURIComponent(
        uri
      )}`
    );
  };

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
          <h1 className="text-3xl font-bold tracking-tight">
            {decodedContractName}
          </h1>
          <p className="text-muted-foreground">
            Contract Details and Documents
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground">
          Contract history and details ({contracts.length} total)
        </p>

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
            <DialogContent className="sm:max-w-4xl max-h-[80vh]">
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
                <TableHead>Filename</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <img src={loadingGif} className="m-auto w-20 h-20" />
                    Loading contracts...
                  </TableCell>
                </TableRow>
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No contracts found for {decodedContractName}
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract, index) => (
                  <TableRow key={contract.key}>
                    <TableCell className="font-medium">
                      {contract.filename}
                    </TableCell>
                    <TableCell>
                      {new Date(contract.last_modified).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="h-4 w-4" />
                        View
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
