// const API_BASE_URL = "https://51a3e11d13f2.ngrok-free.app";
const API_BASE_URL = "https://dev-monotype-contract-ai.huhoka.com";

export interface ContractFolder {
  name: string;
  path: string;
  url: string;
  uri: string;
}

export interface ContractFile {
  key: string;
  filename: string;
  url: string;
  uri: string;
  last_modified: string;
}

export interface FoldersResponse {
  success: boolean;
  folders: ContractFolder[];
}

export interface ContractsResponse {
  success: boolean;
  contracts: ContractFile[];
  total_count: number;
  bucket_name: string;
  folder_name: string;
  message: string;
  timestamp: string;
}

export const contractApi = {
  async getContractFolders(): Promise<FoldersResponse> {
    const response = await fetch(`${API_BASE_URL}/list-s3-folders`, {
      // headers: {
      //   "ngrok-skip-browser-warning": "true",
      // },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch contract folders");
    }

    return response.json();
  },

  async getContractFiles(uri: string): Promise<ContractsResponse> {
    const encodedUri = encodeURIComponent(uri);
    const response = await fetch(
      `${API_BASE_URL}/list-s3-files?uri=${encodedUri}`
      // {
      //   headers: {
      //     "ngrok-skip-browser-warning": "true",
      //   },
      // }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contract files");
    }

    return response.json();
  },
};
