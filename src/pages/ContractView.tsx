import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Code, Check } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ContractView = () => {
  const { contractName, contractId } = useParams<{ contractName: string; contractId: string }>();
  const [searchParams] = useSearchParams();
  const [contractJsonData, setContractJsonData] = useState("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(pageNumber <= 1 ? 1 : pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber >= numPages ? numPages : pageNumber + 1);
  };

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
              {numPages > 0 && (
                <span className="text-sm text-muted-foreground ml-auto">
                  Page {pageNumber} of {numPages}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                Next
              </Button>
            </div>
            <ScrollArea className="h-[550px] w-full border rounded-md">
              <div className="flex justify-center p-4">
                <Document
                  file={contract.pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<div className="text-center p-4">Loading PDF...</div>}
                  error={<div className="text-center p-4 text-red-500">Failed to load PDF</div>}
                >
                  <Page 
                    pageNumber={pageNumber}
                    width={500}
                    loading={<div className="text-center p-4">Loading page...</div>}
                  />
                </Document>
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