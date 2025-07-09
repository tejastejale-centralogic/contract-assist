import { useState } from "react";
import { Search, Filter, Eye, MoreHorizontal, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      title: "Total Contracts",
      value: "450",
      color: "text-foreground"
    },
    {
      title: "Not Started",
      value: "293",
      color: "text-muted-foreground"
    },
    {
      title: "In Progress",
      value: "7",
      color: "text-blue-600"
    },
    {
      title: "Completed",
      value: "150",
      color: "text-green-600"
    }
  ];

  const companies = [
    {
      contractId: "CT-001",
      name: "Microsoft Corporation",
      type: "PUBLIC",
      region: "North America",
      status: "Completed"
    },
    {
      contractId: "CT-002", 
      name: "Amazon.com Inc.",
      type: "PUBLIC",
      region: "North America",
      status: "In Progress"
    },
    {
      contractId: "CT-003",
      name: "Apple Inc.",
      type: "PUBLIC", 
      region: "North America",
      status: "In Progress"
    },
    {
      contractId: "CT-004",
      name: "Alphabet Inc.",
      type: "PUBLIC",
      region: "North America", 
      status: "Not Started"
    },
    {
      contractId: "CT-005",
      name: "Meta Platforms Inc.",
      type: "PUBLIC",
      region: "North America",
      status: "Completed"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap text-xs flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 whitespace-nowrap text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Not Started":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 whitespace-nowrap text-xs flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline" className="whitespace-nowrap text-xs">{status}</Badge>;
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.contractId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Companies List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Companies List</h2>
          <p className="text-muted-foreground">Select a company to view their details</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search companies..."
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
                <TableHead>Contract ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{company.contractId}</TableCell>
                  <TableCell>{company.name}</TableCell>
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
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;