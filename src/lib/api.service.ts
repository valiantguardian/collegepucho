/**
 * Centralized API Service with optimizations
 * Follows the College Pucho API documentation structure
 */

interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

interface CacheConfig {
  revalidate?: number;
  tags?: string[];
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

class ApiService {
  private config: ApiConfig;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      ...config,
    };
  }

  /**
   * Generic API call method with optimizations
   */
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheConfig?: CacheConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const cacheKey = this.generateCacheKey(url, options);

    // Check cache first
    if (cacheConfig?.revalidate) {
      const cached = this.getFromCache(cacheKey, cacheConfig.revalidate);
      if (cached) {
        return { data: cached, status: 200, headers: new Headers() };
      }
    }

    // Prepare fetch options with optimizations
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Next.js caching if available
    if (typeof window === 'undefined' && cacheConfig) {
      (fetchOptions as any).next = {
        revalidate: cacheConfig.revalidate,
        tags: cacheConfig.tags,
      };
    }

    let lastError: Error = new Error('API call failed after all retries');
    
    // Retry logic with exponential backoff
    for (let attempt = 0; attempt < this.config.retries!; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
          
          if (attempt < this.config.retries! - 1) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful responses
        if (cacheConfig?.revalidate) {
          this.setCache(cacheKey, data, cacheConfig.revalidate);
        }

        return { data, status: response.status, headers: response.headers };

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries! - 1) {
          const waitTime = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError || new Error('API call failed after all retries');
  }

  /**
   * Cache management
   */
  private generateCacheKey(url: string, options: RequestInit): string {
    return `${url}_${JSON.stringify(options)}`;
  }

  private getFromCache(key: string, ttl: number): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    });
  }

  /**
   * College APIs (optimized)
   */
  async getColleges(params: {
    page: number;
    limit?: number;
    city_id?: string;
    state_id?: string;
    stream_id?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiCall(`/college-info?${queryParams}`, {}, {
      revalidate: 300, // 5 minutes
      tags: ['colleges'],
    });
  }

  async getCollegeById(id: number): Promise<any> {
    return this.apiCall(`/college-info/${id}`, {}, {
      revalidate: 3600, // 1 hour
      tags: ['colleges', `college-${id}`],
    });
  }

  /**
   * Location APIs (optimized)
   */
  async getCities(): Promise<any> {
    return this.apiCall('/cities', {}, {
      revalidate: 86400, // 24 hours
      tags: ['cities'],
    });
  }

  async getStates(): Promise<any> {
    return this.apiCall('/states', {}, {
      revalidate: 86400, // 24 hours
      tags: ['states'],
    });
  }

  async getStreams(): Promise<any> {
    return this.apiCall('/streams', {}, {
      revalidate: 86400, // 24 hours
      tags: ['streams'],
    });
  }

  /**
   * Course APIs (optimized)
   */
  async getCourses(params: {
    page?: number;
    limit?: number;
    search?: string;
    specialization_id?: string;
    stream_id?: string;
    level?: string;
    course_type?: string;
    course_mode?: string;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiCall(`/courses/filter?${queryParams}`, {}, {
      revalidate: 600, // 10 minutes
      tags: ['courses'],
    });
  }

  /**
   * Article APIs (optimized)
   */
  async getArticles(params: {
    page?: number;
    pageSize?: number;
    author_id?: number;
    tag?: string;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiCall(`/articles?${queryParams}`, {}, {
      revalidate: 1800, // 30 minutes
      tags: ['articles'],
    });
  }

  /**
   * Exam APIs (optimized)
   */
  async getExams(params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiCall(`/exams?${queryParams}`, {}, {
      revalidate: 3600, // 1 hour
      tags: ['exams'],
    });
  }

  /**
   * Home page data (optimized)
   */
  async getHomeData(): Promise<any> {
    return this.apiCall('/home-page', {}, {
      revalidate: 1800, // 30 minutes
      tags: ['home'],
    });
  }

  /**
   * Search functionality (optimized)
   */
  async searchColleges(query: string): Promise<any> {
    return this.apiCall(`/college-info/search?q=${encodeURIComponent(query)}`, {}, {
      revalidate: 300, // 5 minutes
      tags: ['search', 'colleges'],
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.apiCall('/health', {}, {
      revalidate: 60, // 1 minute
      tags: ['health'],
    });
  }

  /**
   * Clear cache by tag
   */
  clearCacheByTag(tag: string): void {
    for (const [key, value] of this.cache.entries()) {
      if (value.data?.tags?.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }
}

// Create singleton instance
const apiService = new ApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.collegepucho.com',
});

export default apiService;
