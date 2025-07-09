export interface ContractFile {
  key: string;
  filename: string;
  url: string;
  last_modified: string;
}

export interface ContractsResponse {
  contracts: ContractFile[];
}

export interface ProcessedContract {
  id: string;
  companyName: string;
  filename: string;
  url: string;
  lastModified: string;
  status: string;
  type: string;
  region: string;
}

export class ContractApiService {
  private static baseUrl = 'YOUR_API_ENDPOINT'; // Replace with actual API endpoint

  static async fetchContracts(): Promise<ContractFile[]> {
    try {
      // Replace this with actual API call
      const response = await fetch(`${this.baseUrl}/contracts`);
      const data: ContractsResponse = await response.json();
      return data.contracts;
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      // Return mock data for now
      return [
        {
          key: "100 contracts/Abbott Laboratories/COMPLETED Abbott Laboratories (HQ) MDD 09 30 2020.pdf",
          filename: "COMPLETED Abbott Laboratories (HQ) MDD 09 30 2020.pdf",
          url: "https://monotype-contract-assist.s3.amazonaws.com/100%20contracts/Abbott%20Laboratories/COMPLETED%20Abbott%20Laboratories%20%28HQ%29%20MDD%2009%2030%202020.pdf",
          last_modified: "2025-07-09T12:03:51+00:00"
        },
        {
          key: "100 contracts/Abbott Laboratories/IN_PROGRESS Abbott Laboratories Sales Agreement 2024.pdf",
          filename: "IN_PROGRESS Abbott Laboratories Sales Agreement 2024.pdf",
          url: "https://monotype-contract-assist.s3.amazonaws.com/100%20contracts/Abbott%20Laboratories/IN_PROGRESS%20Abbott%20Laboratories%20Sales%20Agreement%202024.pdf",
          last_modified: "2025-07-08T10:15:30+00:00"
        },
        {
          key: "100 contracts/Microsoft Corporation/COMPLETED Microsoft Enterprise License 2024.pdf",
          filename: "COMPLETED Microsoft Enterprise License 2024.pdf",
          url: "https://monotype-contract-assist.s3.amazonaws.com/100%20contracts/Microsoft%20Corporation/COMPLETED%20Microsoft%20Enterprise%20License%202024.pdf",
          last_modified: "2025-07-07T14:22:15+00:00"
        }
      ];
    }
  }

  static extractCompanyFromKey(key: string): string {
    const parts = key.split('/');
    return parts.length > 1 ? parts[1] : 'Unknown';
  }

  static extractStatusFromFilename(filename: string): string {
    if (filename.startsWith('COMPLETED')) return 'Completed';
    if (filename.startsWith('IN_PROGRESS')) return 'In Progress';
    if (filename.startsWith('PENDING')) return 'Pending';
    return 'Draft';
  }

  static processContracts(contracts: ContractFile[]): ProcessedContract[] {
    return contracts.map((contract, index) => {
      const companyName = this.extractCompanyFromKey(contract.key);
      const status = this.extractStatusFromFilename(contract.filename);
      
      return {
        id: `${companyName}-${index + 1}`,
        companyName,
        filename: contract.filename,
        url: contract.url,
        lastModified: contract.last_modified,
        status,
        type: status === 'Completed' ? 'PUBLIC' : 'PRIVATE',
        region: 'North America' // Default region, could be extracted from data if available
      };
    });
  }

  static getContractsByCompany(contracts: ContractFile[], companyName: string): ProcessedContract[] {
    const filteredContracts = contracts.filter(contract => 
      this.extractCompanyFromKey(contract.key) === companyName
    );
    return this.processContracts(filteredContracts);
  }

  static getContractById(contracts: ContractFile[], companyName: string, contractId: string): ProcessedContract | null {
    const companyContracts = this.getContractsByCompany(contracts, companyName);
    return companyContracts.find(contract => contract.id === contractId) || null;
  }
}