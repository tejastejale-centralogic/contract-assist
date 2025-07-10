import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, FileText, Code, Check } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ContractView = () => {
  const { contractName, contractId } = useParams<{
    contractName: string;
    contractId: string;
  }>();
  const [searchParams] = useSearchParams();
  const [contractJsonData, setContractJsonData] = useState("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasSelected, setHasSelected] = useState(false);
  const [select, setSelect] = useState("");
  const decodedContractName = decodeURIComponent(contractName || "");
  const decodedContractId = decodeURIComponent(contractId || "");
  const pdfUrl = searchParams.get("url") || "";
  const s3Uri = searchParams.get("uri") || "";

  // Create contract data from URL parameters
  const contract = {
    id: decodedContractId,
    name: decodedContractId,
    type: "PDF Document",
    region: "Unknown",
    status: "Available",
    startDate: "N/A",
    endDate: "N/A",
    pdfUrl: pdfUrl,
  };

  const [loadingJson, setLoadingJson] = useState(false);

  // Fetch JSON from API when contract.pdfUrl or select changes
  useEffect(() => {
    const fetchJsonFromApi = async () => {
      if (!pdfUrl || !hasSelected) return; // Skip if not selected yet
      setLoadingJson(true);
      try {
        const response = await axios.post(
          "https://faccb2ea89f9.ngrok-free.app/extract-contract-from-s3",
          {
            s3_uri: s3Uri,
            contract_type: select,
          }
        );
        if (response.data?.success)
          setContractJsonData(JSON.stringify(response.data.data, null, 2));
      } catch (error) {
        setContractJsonData("// Failed to load contract JSON");
      } finally {
        setLoadingJson(false);
      }
    };

    fetchJsonFromApi();
  }, [select, pdfUrl, s3Uri, hasSelected]);

  const handleApprove = () => {
    alert(`Contract ${decodedContractId} approved successfully!`);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelect(value);
    setHasSelected(true); // mark that user selected something
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
        <Link
          to={`/contract/${encodeURIComponent(
            contractName || ""
          )}?uri=${encodeURIComponent(searchParams.get("globalUri") || "")}`}
        >
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {decodedContractId.replace(".pdf", "")}
          </h1>
          <p className="text-muted-foreground">{decodedContractName}</p>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* PDF Viewer Card */}
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document
              {numPages > 0 && (
                <span className="text-sm text-muted-foreground ml-auto">
                  Page {pageNumber} of {numPages}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 w-full border rounded-md overflow-hidden">
              <iframe
                src={contract.pdfUrl}
                className="w-full h-full min-h-0 border-0"
                style={{ display: "block" }}
                title="Contract PDF"
              />
            </div>
          </CardContent>
        </Card>

        {/* JSON Viewer Card */}
        <Card className="h-[700px]">
          <CardHeader className="flex flex-wrap flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              JSON
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative inline-block w-fit">
                <select
                  onChange={handleSelectChange}
                  value={select}
                  className="appearance-none w-full border border-gray-300 rounded-md h-10 pl-3 pr-10 text-sm text-gray-700 bg-white shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-linear"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                >
                  <option value="" disabled hidden>
                    Select Contract Type
                  </option>
                  <option value="MTF">MTF</option>
                  <option value="MTF_Legacy">Legacy</option>
                  <option value="MTF_Pula">PULA</option>
                </select>

                {/* Custom Dropdown Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {contractJsonData !== "// Failed to load contract JSON" &&
                contractJsonData && (
                  <Button onClick={handleApprove} className="gap-2">
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                )}
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[600px] w-full">
              <Textarea
                value={loadingJson ? "// Loading..." : contractJsonData}
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
