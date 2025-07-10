import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const ContractView = () => {
  const { contractName, contractId } = useParams<{ contractName: string; contractId: string }>();
  const [searchParams] = useSearchParams();
  const [contractJsonData, setContractJsonData] = useState("");
  
  const decodedContractName = decodeURIComponent(contractName || "");
  const decodedContractId = decodeURIComponent(contractId || "");
  const pdfUrl = searchParams.get('url') || '';

  // Create contract data from URL parameters
  const contract = {
    id: decodedContractId,
    name: decodedContractId,
    type: "PDF Document",
    region: "Unknown",
    status: "Available",
    startDate: "N/A",
    endDate: "N/A",
    pdfUrl: pdfUrl
  };

  console.log(contract.pdfUrl)

  // Initialize JSON data when component mounts
  useEffect(() => {
    const jsonData = {
      contractId: contract.id,
      contractName: contract.name,
      companyName: decodedContractName,
      contractDetails: {
        type: contract.type,
        region: contract.region,
        status: contract.status,
        startDate: contract.startDate,
        endDate: contract.endDate,
        pdfUrl: contract.pdfUrl,
        metadata: {
          createdDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: "1.0"
        }
      }
    };
    setContractJsonData(JSON.stringify(jsonData, null, 2));
  }, [contract, decodedContractName]);

  const handleApprove = () => {
    alert(`Contract ${decodedContractId} approved successfully!`);
  };

  if (!pdfUrl) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Contract URL not found</p>
        </div>
      </div>
    );
  }

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{decodedContractId}</h1>
          <p className="text-muted-foreground">{decodedContractName}</p>
        </div>
      </div>

      {/* Two-column layout - always side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* PDF Viewer Card */}
        <Card className="h-[700px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Document
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[600px] w-full border rounded-md">
              <div className="w-full h-full">
                <iframe
                  src={contract.pdfUrl}
                  className="w-full h-[580px] border-0"
                  title="Contract PDF"
                />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* JSON Viewer Card */}
        <Card className="h-[700px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Contract JSON Data
            </CardTitle>
            <Button onClick={handleApprove} className="gap-2">
              <Check className="h-4 w-4" />
              Approve
            </Button>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[600px] w-full">
              <Textarea
                value={contractJsonData}
                onChange={(e) => setContractJsonData(e.target.value)}
                className="h-[580px] w-full text-xs font-mono resize-none border-0 focus-visible:ring-0"
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