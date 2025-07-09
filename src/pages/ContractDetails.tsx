import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const ContractDetails = () => {
  const { contractName } = useParams<{ contractName: string }>();
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contractJsonData, setContractJsonData] = useState("");
  const navigate = useNavigate();

  const decodedContractName = decodeURIComponent(contractName || "");

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        
        // Call API to get contract data by company name
        const response = await fetch(`YOUR_API_ENDPOINT/contracts`);
        const data = await response.json();
        
        // Find contracts for this company
        const companyContracts = data.contracts.filter((contract: any) => {
          const parts = contract.key.split('/');
          const companyFromKey = parts.length > 1 ? parts[1] : '';
          return companyFromKey === decodedContractName;
        });
        
        if (companyContracts.length > 0) {
          // For now, just take the first contract
          const firstContract = companyContracts[0];
          setContract(firstContract);
          
          // Create JSON data from the contract
          const jsonData = {
            filename: firstContract.filename,
            url: firstContract.url,
            key: firstContract.key,
            lastModified: firstContract.last_modified,
            company: decodedContractName
          };
          setContractJsonData(JSON.stringify(jsonData, null, 2));
        }
      } catch (error) {
        console.error('Failed to fetch contract:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contractName) {
      fetchContract();
    }
  }, [contractName, decodedContractName]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{decodedContractName}</h1>
            <p className="text-muted-foreground">Contract Document</p>
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
                    <p><strong>Company:</strong> {decodedContractName}</p>
                    <p><strong>Last Modified:</strong> {new Date(contract.last_modified).toLocaleDateString()}</p>
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
                placeholder="Contract data will appear here..."
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractDetails;