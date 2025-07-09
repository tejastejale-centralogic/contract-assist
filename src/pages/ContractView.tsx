import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const ContractView = () => {
  const { contractName, contractId } = useParams<{ contractName: string; contractId: string }>();
  const [contractJsonData, setContractJsonData] = useState("");
  
  const decodedContractName = decodeURIComponent(contractName || "");

  // Mock contract data based on ID
  const getContractData = (id: string) => {
    const contracts = {
      "CT-001": {
        id: "CT-001",
        name: "Master Distribution Agreement",
        type: "PUBLIC",
        region: "North America",
        status: "Completed",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      "CT-002": {
        id: "CT-002",
        name: "Service Level Agreement",
        type: "PRIVATE",
        region: "North America",
        status: "In Progress",
        startDate: "2024-03-15",
        endDate: "2025-03-15",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      "CT-003": {
        id: "CT-003",
        name: "Non-Disclosure Agreement",
        type: "PRIVATE",
        region: "North America",
        status: "Not Started",
        startDate: "2024-06-01",
        endDate: "2024-12-01",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    };

    return contracts[id as keyof typeof contracts] || null;
  };

  const contract = getContractData(contractId || "");

  // Initialize JSON data when component mounts
  useEffect(() => {
    if (contract) {
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
    }
  }, [contract, decodedContractName]);

  const handleApprove = () => {
    alert(`Contract ${contractId} approved successfully!`);
  };

  if (!contract) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Contract not found</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Contract {contractId}</h1>
          <p className="text-muted-foreground">{decodedContractName} - {contract.name}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer Card */}
        <Card className="h-[700px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Document
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[600px] w-full border rounded-md p-4">
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded">
                  <iframe
                    src={contract.pdfUrl}
                    className="w-full h-96 border-0"
                    title="Contract PDF"
                  />
                  <div className="mt-2 text-center">
                    <a 
                      href={contract.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Open PDF in new tab
                    </a>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Contract ID:</strong> {contract.id}</p>
                  <p><strong>Contract Name:</strong> {contract.name}</p>
                  <p><strong>Company:</strong> {decodedContractName}</p>
                  <p><strong>Type:</strong> {contract.type}</p>
                  <p><strong>Region:</strong> {contract.region}</p>
                  <p><strong>Status:</strong> {contract.status}</p>
                  <p><strong>Start Date:</strong> {contract.startDate}</p>
                  <p><strong>End Date:</strong> {contract.endDate}</p>
                </div>
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