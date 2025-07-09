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
      title: "Total Companies",
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
      name: "Microsoft Corporation",
      domain: "microsoft.com",
      region: "North America",
      type: "PUBLIC",
      assignee: "John Smith",
      status: "Completed"
    },
    {
      name: "Amazon.com Inc.",
      domain: "amazon.com",
      region: "North America",
      type: "PUBLIC",
      assignee: "Sarah Johnson",
      status: "In Progress"
    },
    {
      name: "Apple Inc.",
      domain: "apple.com",
      region: "North America",
      type: "PUBLIC",
      assignee: "Mike Davis",
      status: "In Progress"
    },
    {
      name: "Alphabet Inc.",
      domain: "abc.xyz",
      region: "North America",
      type: "PUBLIC",
      assignee: "Emily Chen",
      status: "Not Started"
    },
    {
      name: "Meta Platforms Inc.",
      domain: "meta.com",
      region: "North America",
      type: "PUBLIC",
      assignee: "David Wilson",
      status: "Completed"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Not Started":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Company Research Queue */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Company Research Queue</h2>
          <p className="text-muted-foreground">Select a company to view or start its subsidiary research workflow</p>
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
                <TableHead>Company Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="text-muted-foreground">{company.domain}</TableCell>
                  <TableCell>{company.region}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-black text-white">
                      {company.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.assignee}</TableCell>
                  <TableCell>
                    {getStatusBadge(company.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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