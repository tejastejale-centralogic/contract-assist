import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getContractJson } from "@/services/contractApi";

const ContractView = () => {
  const { contractName, contractId } = useParams<{
    contractName: string;
    contractId: string;
  }>();
  const [pageNo, setPageNo] = useState("1");
  const [searchParams] = useSearchParams();
  const [contractJsonData, setContractJsonData] = useState({});
  // const [contractJsonData, setContractJsonData] = useState({
  //   "Contract Start Date": "18/12/2020",
  //   "Contract End Date": "18/12/2023",
  //   "Contract Number": "M00201548",
  //   "Contract Type": "Design and Deploy License and Order Form",
  //   "Offline Contract": null,
  //   Territory: "United States",
  //   "Agreement Level": "Original Contract",
  //   "Monotype Contracting Entity": "Monotype Imaging Inc.",
  //   "Customer Name": "Abbott Laboratories",
  //   "Customer Contact Email": "craig.bryson@abbott.com",
  //   "Customer Contact First Name": "Craig",
  //   "Customer Contact Last Name": "Bryson",
  //   "Web Page Views": "Unlimited",
  //   "Material Number (Add-On Fonts)": [
  //     "167394803",
  //     "167394804",
  //     "167394805",
  //     "167394806",
  //     "167394807",
  //     "167394808",
  //     "167394809",
  //     "167394810",
  //     "167394811",
  //     "167394812",
  //     "167394813",
  //     "167394814",
  //     "167456579",
  //     "167456581",
  //     "167456583",
  //     "167456587",
  //     "167456589",
  //     "167486242",
  //     "167429384",
  //     "167425280",
  //     "167425290",
  //     "167437933",
  //     "167444538",
  //     "167444539",
  //     "167444540",
  //     "167444541",
  //     "167444542",
  //     "167444543",
  //     "167444544",
  //     "167444546",
  //     "167444549",
  //     "16780344",
  //     "16781025",
  //     "16781026",
  //     "16781027",
  //     "16781032",
  //     "168211470",
  //     "168211471",
  //     "168211472",
  //     "168374438",
  //     "168390753",
  //     "168403719",
  //     "168403721",
  //     "168403724",
  //     "168403726",
  //     "168421278",
  //     "168421286",
  //     "168421298",
  //     "168437966",
  //     "168437970",
  //     "168437972",
  //     "168437974",
  //     "168437976",
  //     "16870730",
  //     "16870731",
  //     "16870733",
  //     "16870735",
  //   ],
  //   DocumentID: "3A7F3D38-FEDB-4797-A7C2-FDEF322C352A",
  //   "Payment Terms/Information":
  //     "$400,000.00 due ninety (90) days from Contract Start Date; $100,000.00 invoiced on the first anniversary of Contract Start Date; $100,000.00 invoiced on the second anniversary of Contract Start Date; All payments shall be made to Monotype Imaging Inc., 600 Unicorn Park Drive, Woburn, MA, 01801; Wire transfer instructions: Bank of America, 100 West 33rd Street, New York, NY 10001, Account # 0027400052, Account Name: Monotype Imaging Inc. AKA International Typeface Corporation (ITC), Routing # 026009593, Chips Participant ID (If Applicable): 095, SWIFT: BOFAUS3N; Notification of payment to: Monotype Imaging Inc., Finance Department, 600 Unicorn Park Drive, Woburn, MA, 01801",
  //   Installments: "Yes",
  //   "No. of Installments": 3,
  //   "License Fee - Recurring, One Time, Past Use, Currency":
  //     "Permitted Usage Fee: USD $600,000.00 exclusive of taxes and duties",
  //   "No. of days notice – Termination": 30,
  //   "Purchase order calendar days": 30,
  //   "Governing Law": "State of New York",
  //   "Contracting Monotype Entity": "Monotype Imaging Inc.",
  //   "Arbitration/Mediation/Alternative Dispute Resolution Applicable": null,
  //   Confidentiality:
  //     "The parties agree that the obligations of confidentiality shall be for the Term of this Agreement, and for a period of ten (10) years thereafter. In the case of Personal Information, the obligations of confidentiality shall survive indefinitely, for so long as the Receiving Party retains the Personal Information. Confidential Information includes all Personal Information. The Receiving Party shall only use, disclose or otherwise Process the Confidential Information for purposes of and in connection with this Agreement. Each party agrees to protect the confidentiality of the Confidential Information of the other in the same manner that it protects the confidentiality of its own proprietary and confidential information of like kind, but in no event shall either party exercise less than reasonable care in protecting such Confidential Information.",
  //   "Export Control Clause":
  //     "If delivery to you as set forth in this Agreement is prohibited by the United States Export Administration or any applicable export laws, restrictions or regulations, this Agreement shall be deemed void. Each party shall be responsible for ensuring that its actions with respect to the Software are in compliance with the export control Laws of the United States (“Export Control Laws”). Monotype covenants to Customer that, as of the Effective Date, the Software is self classified as EAR99.",
  //   "Force Majeure Clause":
  //     "Any delay in or prevention of the performance of any of the duties or obligations of any party (other than the payment of fees owed) caused by an event outside the affected party’s reasonable control shall not be considered a breach of this Agreement, and neither party shall be liable for losses or damages resulting from such delay and the time required for performance shall be extended for a period equal to the period of such delay, but in no event longer than thirty (30) days. Such events include acts of God, acts of the public enemy, terrorist acts, insurrections, riots, injunctions, embargoes, fires, explosions, floods, earthquakes, or other unforeseeable causes beyond the reasonable control, and without the fault or negligence, of the party so affected.",
  //   Indemnification:
  //     "Monotype shall defend Customer and its Affiliates from any claims brought by a third party based on breach of warranty, intellectual property infringement, negligence, willful misconduct, gross negligence, or fraud, and indemnify Customer against damages, costs, and fees resulting from such claims.",
  //   Liability:
  //     "Neither Party shall be responsible for any damages caused solely by the other party’s failure to materially perform its obligations under this Agreement. Except in the event of breach of confidentiality, indemnification for any third party Claims, breach of its data privacy, protection or security obligations, Personal Data Breach, gross negligence, recklessness, willful or intentional misconduct, fraud or bad faith, neither party will be responsible for incidental, indirect, consequential or punitive damages, including lost profits, business interruption, loss of use or lost data.",
  //   "Liability Limitation":
  //     "With respect to a breach of a party’s data privacy and security obligations or a Personal Data Breach, a party’s liability shall not exceed the greater of ten times the fees paid or payable under this Agreement or ten million dollars USD ($10,000,000.00).",
  //   "Notice Recipient (Customer)": "Craig Bryson, DVP",
  //   "Notice deemed to be received after (time period)": "48 hours",
  //   Warranties:
  //     "The Software, Desktop Application and Mosaic platform will effect a faithful reproduction of the underlying typeface design which is of a quality consistent with industry standards. The Software, Desktop Application and Mosaic platform have no defect nor is deficient in title; Monotype has all necessary rights, title, licenses, permissions, and approvals required to grant the rights and licenses to the Software, Desktop Application and Mosaic platform as set forth in this Agreement; The Software is not Publicly Available Software.",
  //   "Warranty Period": null,
  //   "Parent Contract Name": null,
  //   "Parent Contract Number": null,
  //   "Parent Contract Date": null,
  //   "Primary Licensed Monotype Fonts User Email": "kelly.baranko@abbott.com",
  //   "Licensed Monotype Fonts User": 100,
  //   "Additional Desktop User Count": null,
  //   "Production font": 50,
  //   "Company Desktop License": "Yes",
  //   "Monotype Font Support": "No",
  //   "Swapping Allowed": "Yes",
  //   "Plus Inventory": null,
  //   "Adobe Originals": null,
  //   "Monotype Fonts Plan": null,
  //   "Monotype Font/User Management": null,
  //   "Single Sign-On Option": null,
  //   "Typography Centre of Excellence": null,
  //   "Studio Services": "No",
  //   "Custom Font Deliverables Description": null,
  //   "Bespoke Custom Font Software": null,
  //   "Sublicense Rights":
  //     "You are entitled to sublicense the rights granted herein, with the exception of this sublicense right (except that an Affiliate shall have the right to sublicense the rights to an independent contractor or third party service provider), under the conditions set forth below to the following entities: your Affiliates, as defined herein. You are entitled to sublicense to such entities under the conditions that (a) the sublicensee accepts all terms of this Agreement and (b) you shall be fully responsible for a breach of these terms by a sublicensee.",
  // });
  const [view, setView] = useState("table");
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
        const response = await getContractJson(s3Uri, select);
        if (response.data?.success) console.log(response.data.data);
        setContractJsonData(response.data.data);
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

  const [leftWidth, setLeftWidth] = useState(60); // percentage

  const handleDrag = (e: React.MouseEvent) => {
    const container = document.getElementById("resizable-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const getTableView = () => {
    return Object.entries(contractJsonData).map(([key, value]) => {
      const displayValue = value ?? "";
      const isLongText =
        typeof displayValue === "string" && displayValue.length > 20;
      const commonClasses =
        "border rounded-lg p-2 py-1 w-full text-sm font-sans";
      const isArray = Array.isArray(value);

      return (
        <div
          key={key}
          className="grid grid-cols-[auto_auto_1fr] items-start gap-2 mt-2"
        >
          <div className="border overflow-y-auto flex max-h-20 rounded-lg p-2 py-1 text-gray-700 w-[10rem] break-normal text-sm font-sans">
            {key}
          </div>
          <div className="text-center pt-1">:</div>

          {isArray ? (
            <div className="flex flex-col gap-1 w-full">
              {value.map((item, idx) => (
                <input
                  key={`${key}-${idx}`}
                  className={commonClasses}
                  value={item}
                  placeholder="None"
                  onChange={(e) =>
                    setContractJsonData((prev) => ({
                      ...prev,
                      [key]: [
                        ...(prev[key] || []).map((v, i) =>
                          i === idx ? e.target.value : v
                        ),
                      ],
                    }))
                  }
                />
              ))}
            </div>
          ) : isLongText ? (
            <Textarea
              className={`${commonClasses} min-h-[80px] resize-none`}
              value={displayValue}
              placeholder="None"
              onChange={(e) =>
                setContractJsonData((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
            />
          ) : (
            <input
              className={commonClasses}
              value={displayValue}
              placeholder="None"
              onChange={(e) =>
                setContractJsonData((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
            />
          )}
        </div>
      );
    });
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

      <div
        id="resizable-container"
        className="flex h-[700px] w-full border rounded-lg overflow-hidden relative"
      >
        {/* Left: PDF Viewer */}
        <div className="h-full" style={{ width: `${leftWidth}%` }}>
          <Card className="h-full flex flex-col rounded-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <iframe
                key={pageNo}
                src={`${contract.pdfUrl}#page=${pageNo}`}
                className="w-full h-full border-0"
                title="Contract PDF"
              />
            </CardContent>
          </Card>
        </div>

        {/* Divider */}
        <div
          className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-500 transition-all"
          onMouseDown={(e) => {
            const onMove = (e: MouseEvent) =>
              handleDrag(e as unknown as React.MouseEvent);
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        />

        {/* Right: Data Viewer */}
        <div className="h-full flex-1 min-w-[200px]">
          <Card className="h-full rounded-none">
            <CardHeader className="flex flex-wrap flex-row items-center justify-between">
              <div className="w-full justify-between items-center flex">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Extracted Data
                </CardTitle>
              </div>

              <div className="flex w-full justify-between gap-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={(e) =>
                      setView(e.target.checked ? "table" : "json")
                    }
                    checked={view === "table"}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Table
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative inline-block w-fit">
                    <select
                      onChange={handleSelectChange}
                      value={select}
                      className="appearance-none w-full border border-gray-300 rounded-md h-[2.3rem] pl-3 pr-10 text-sm text-gray-700 bg-white shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-linear"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="" disabled hidden>
                        Select Contract Type
                      </option>
                      <option value="mtf">MTF</option>
                      <option value="mtf_legacy">Legacy</option>
                      <option value="mtf_pula">PULA</option>
                      <option value="psa">PSA</option>
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
                    contractJsonData !== "" && (
                      <Button
                        onClick={handleApprove}
                        size="sm"
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full overflow-hidden p-0">
              {loadingJson ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm -mt-20">
                  Loading extracted contract data...
                </div>
              ) : contractJsonData === "// Failed to load contract JSON" ? (
                <div className="h-full flex items-center justify-center text-red-500 text-sm">
                  Failed to load contract JSON.
                </div>
              ) : Object.keys(contractJsonData || {}).length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm -mt-20">
                  No data extracted from this contract.
                </div>
              ) : view === "json" ? (
                <ScrollArea className="h-[600px] w-full">
                  <Textarea
                    value={JSON.stringify(contractJsonData, null, 2)}
                    className="h-[580px] w-full text-xs font-mono resize-none border-0 focus-visible:ring-0"
                    placeholder="Edit JSON data..."
                  />
                </ScrollArea>
              ) : (
                <div className="h-[620px] overflow-y-auto border-t-2 p-5 pb-10">
                  <div className="flex flex-col gap-3 w-full max-w-full">
                    {getTableView()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractView;
