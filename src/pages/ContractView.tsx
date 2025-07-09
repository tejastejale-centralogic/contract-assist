import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContractView = () => {
  const { contractName, contractId } = useParams<{ contractName: string; contractId: string }>();
  
  const decodedContractName = decodeURIComponent(contractName || "");

  // Sample PDF content placeholder (in real app, this would be the actual PDF viewer)
  const pdfPlaceholder = "PDF Document content would be displayed here. This is a placeholder for the actual PDF viewer component.";

  // Sample JSON data for the contract
  const contractJsonData = {
    contractId: contractId,
    companyName: decodedContractName,
    contractDetails: {
      type: "PUBLIC",
      region: "North America",
      status: "Completed",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      value: "$150,000",
      signatories: [
        {
          name: "John Smith",
          role: "Contract Manager",
          signedDate: "2024-01-15"
        },
        {
          name: "Jane Doe",
          role: "Legal Representative",
          signedDate: "2024-01-15"
        }
      ],
      terms: {
        paymentSchedule: "Monthly",
        deliverables: [
          "Software License",
          "Technical Support",
          "Training Services"
        ],
        penalties: {
          latePayment: "2% per month",
          earlyTermination: "$10,000"
        }
      },
      compliance: {
        regulatoryFramework: "SOX",
        auditRequired: true,
        reportingFrequency: "Quarterly"
      },
      amendments: [
        {
          date: "2024-06-15",
          type: "Scope Extension",
          description: "Added additional training modules"
        }
      ]
    }
  };

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
          <p className="text-muted-foreground">{decodedContractName} - Document View</p>
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
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded text-center text-muted-foreground">
                  {pdfPlaceholder}
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Document Title:</strong> Service Agreement - {decodedContractName}</p>
                  <p><strong>Contract ID:</strong> {contractId}</p>
                  <p><strong>Document Type:</strong> PDF</p>
                  <p><strong>File Size:</strong> 2.4 MB</p>
                  <p><strong>Pages:</strong> 15</p>
                  <p><strong>Last Modified:</strong> 2024-01-15</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Document Preview</h4>
                  <p className="text-sm text-gray-600">
                    This service agreement ("Agreement") is entered into on January 15, 2024, 
                    between {decodedContractName} ("Client") and our organization ("Service Provider").
                    The terms and conditions outlined herein govern the provision of software 
                    licensing and technical support services...
                  </p>
                </div>
              </div>
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
              <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto">
                {JSON.stringify(contractJsonData, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractView;