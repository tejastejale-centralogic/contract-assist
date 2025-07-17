import axios from "axios";
import { getFiles, getJson, listFolders } from "./constant";

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

export const getContractJson = async (s3Uri: string, select: string) => {
  const res = await axios.post(`${getJson}`, {
    s3_uri: s3Uri,
    contract_type: select,
  });
  return res;
};

export const contractApi = {
  async getContractFolders(): Promise<FoldersResponse> {
    const response = await fetch(`${listFolders}`, {
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
      `${getFiles}?uri=${encodedUri}`
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
