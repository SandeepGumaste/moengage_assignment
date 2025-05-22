import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import responseCodes from "@/lib/responseCodes.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ResponseCodeMap = Record<string, number[]>;

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    window.location.href = "/";
    return Promise.reject(new Error("No authentication token found"));
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/";
    return Promise.reject(new Error("Authentication failed"));
  }

  return response;
}

export function getAllResponseCodes(groups: Record<string, number[]>): string[] {
  return Object.values(groups)
    .flat()
    .map(code => code.toString())
}

function matchesFilter(code: string, filter: string): boolean {
  // console.log(code, filter, "code and filter");
  if (filter.endsWith("xx")) {
    const prefix = filter[0];
    return code.startsWith(prefix);
  }

  if (filter.endsWith("x")) {
    const prefix = filter.slice(0, -1);
    return code.startsWith(prefix);
  }

  return code === filter;
}

export function getFilteredResponseCodeUrls(
  filter: string,
): {code:string, url:string}[] {
  const result = [];
  const responseCodeMap: ResponseCodeMap = responseCodes
  const allResponseCodes = getAllResponseCodes(responseCodeMap);
  // console.log(allResponseCodes, "allResponseCodes");
  


  for (const code of allResponseCodes) {
    // console.log(code,"code");
    if (matchesFilter(code, filter)) {
      result.push({code, url: `https://http.dog/${code}.jpg`});
    }
  }
  // console.log(result, "Result");

  return result;
}
