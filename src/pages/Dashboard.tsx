import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, MoreHorizontal, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleViewContract = (contractName: string) => {
    navigate(`/contract/${encodeURIComponent(contractName)}`);
  };

  const stats = [
    {
      title: "Total Contracts",
      value: "100",
      color: "text-foreground"
    },
    {
      title: "Not Started",
      value: "65",
      color: "text-muted-foreground"
    },
    {
      title: "In Progress",
      value: "20",
      color: "text-blue-600"
    },
    {
      title: "Completed",
      value: "15",
      color: "text-green-600"
    }
  ];

  const contractNames = [
    "Abbott Laboratories", "Abercrombie and Fitch Co", "Alice and Olivia LLC", "Aller Media AB", "AppLovin",
    "Arcturus SRL", "Autumnpaper Limited", "Banyan Tree Holdings Limited", "BEIJING SKYLINE", "Blueland",
    "Bon Secours Mercy", "Bona AB", "Brooks Sports Inc", "Canva Pty Ltd", "Carhartt, Inc",
    "Celio France SAS", "Cove Property", "Deluxe Corporation", "DexCom, Inc", "Diageo Great Britain Ltd",
    "DS Smith PLC", "Dsquared2 Retail CH", "Endeavor LLC", "Fenix Outdoor AB", "Fiserv, Inc",
    "Focus Brands LLC", "followfood GmbH", "FreedomPay", "Fresh American LLC", "FUNKE Services",
    "Gebr Heinemann SE", "Grindr LLC", "Grupa Pracuj S.A", "Grupo Santillana Educación", "Hancock Whitney",
    "Hasbro Inc", "HEINZ GLAS GmbH", "Hoepli S.p.A", "Houghton Mifflin Harcourt USA", "Intercontinental Hotel Group",
    "Intermarketing Agency", "Interstuhl Büromöbel GmbH", "intomedia GmbH", "KeyBank National Association", "Kohler Co., Inc",
    "Land ID", "Leadership Boulevard", "Loro Piana S.p.A", "M.I. Industries Inc", "Makita U.S.A., Inc",
    "McCormick Company", "medigital GmbH", "Merck Sharp & Dohme Corp", "Nest New York", "Nike USA Inc",
    "Pair Eyewear", "Patagonia, Inc", "Pension Insurance Corp", "PetSmart LLC", "Pixiv Inc",
    "Plus Retail B.V", "Proper Brands", "PVH Corp", "Raiffeisen S.A", "Reima Europe Oy",
    "Remitly, Inc", "Resolution Life Services", "Roma KG", "RR Donnelley and Sons Co", "Rudolf Roser Verlag und Informationsdienste",
    "Salesforce.com, Inc", "Sand Cloud", "Save The Duck S.p.A", "Scientific Games Corporation", "Set Sail Limited",
    "Shady Rays", "Shanghai Soulgate Technology", "Shenzhen Haoqtiansuo", "Sky News Arabia", "Sonntag and Partner",
    "Spanx, LLC", "Stromnetz Hamburg", "Superunion Limited", "Tapi Carpets and Floors", "TeamViewer Germany",
    "The Big Carrot", "The Reynolds Company", "The Scotts Miracle-Gro Company", "The Shade Store", "The Vanguard Group",
    "The Júlios S.p.A", "Toypa Mağ⁞⁞azac⁞⁞ılık Tic", "Trimble Inc", "TV MIDT-VEST", "Unilever UK Central Ltd",
    "VGW Corporate Services", "Visang Education Inc", "WEST Werbeagentur GmbH", "YETI Coolers, LLC", "Zynga Inc"
  ];

  const types = ["PUBLIC", "PRIVATE", "NON-PROFIT", "GOVERNMENT"];
  const regions = ["North America", "Europe", "Asia", "South America", "Africa", "Oceania"];
  const statuses = ["Completed", "In Progress", "Not Started"];

  const companies = contractNames.map((name, index) => ({
    contractId: `CT-${String(index + 1).padStart(3, '0')}`,
    name,
    type: types[index % types.length],
    region: regions[index % regions.length],
    status: statuses[index % statuses.length]
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Not Started":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">
            <XCircle className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline" className="whitespace-nowrap text-xs px-2 py-1 h-auto w-fit">{status}</Badge>;
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contract Assist</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground">Select a contract to view their details</p>
        
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
            Filter Status
          </Button>
        </div>

        {/* Data Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCompanies.map((company, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-black text-white">
                      {company.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.region}</TableCell>
                  <TableCell>
                    {getStatusBadge(company.status)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleViewContract(company.name)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;