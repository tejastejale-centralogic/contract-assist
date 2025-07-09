import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ContractApiService, type ProcessedContract } from "@/services/contractApi";

const ContractView = () => {
  const { contractName, contractId } = useParams<{ contractName: string; contractId: string }>();
  const [contract, setContract] = useState<ProcessedContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [contractJsonData, setContractJsonData] = useState("");
  
  const decodedContractName = decodeURIComponent(contractName || "");

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const allContracts = await ContractApiService.fetchContracts();
        const foundContract = ContractApiService.getContractById(allContracts, decodedContractName, contractId || "");
        
        if (foundContract) {
          setContract(foundContract);
          
          // Create JSON data from the contract
          const jsonData = {
            contractId: foundContract.id,
            companyName: foundContract.companyName,
            filename: foundContract.filename,
            url: foundContract.url,
            contractDetails: {
              type: foundContract.type,
              region: foundContract.region,
              status: foundContract.status,
              lastModified: foundContract.lastModified,
              fileInfo: {
                size: "Unknown",
                pages: "Unknown",
                format: "PDF"
              }
            }
          };
          setContractJsonData(JSON.stringify(jsonData, null, 2));
        }
      } catch (error) {
        console.error('Failed to fetch contract:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContract();
    }
  }, [decodedContractName, contractId]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to={`/contract/${encodeURIComponent(contractName || "")}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract {contractId}</h1>
          <p className="text-muted-foreground">{decodedContractName} - Document View</p>
        </div>
          <Button>Approve</Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer Card */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Document
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[500px] w-full border rounded-md p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading contract...</p>
                </div>
              ) : contract ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <iframe
                      src={contract.url}
                      className="w-full h-64 border-0"
                      title="Contract PDF"
                    />
                    <div className="mt-2 text-center">
                      <a 
                        href={contract.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Open PDF in new tab
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Document Title:</strong> {contract.filename}</p>
                    <p><strong>Contract ID:</strong> {contract.id}</p>
                    <p><strong>Document Type:</strong> PDF</p>
                    <p><strong>Status:</strong> {contract.status}</p>
                    <p><strong>Company:</strong> {contract.companyName}</p>
                    <p><strong>Last Modified:</strong> {new Date(contract.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Contract not found</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* JSON Viewer Card */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Contract JSON Data
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[500px] w-full">
              <Textarea
                value={contractJsonData}
                onChange={(e) => setContractJsonData(e.target.value)}
                className="h-[480px] w-full text-xs font-mono resize-none border-0 focus-visible:ring-0"
                placeholder="Edit JSON data..."
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractView;