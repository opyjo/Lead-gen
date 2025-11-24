
interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

const rateLimit = (options: RateLimitConfig) => {
  const tokenCache = new Map<string, number[]>();

  return {
    check: (limit: number, token: string) => {
      return new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const windowStart = now - options.interval;

        const tokenCount = tokenCache.get(token) || [];
        
        // Filter out old timestamps
        const validTokens = tokenCount.filter((timestamp) => timestamp > windowStart);
        
        if (validTokens.length >= limit) {
          reject(new Error('Rate limit exceeded'));
        } else {
          validTokens.push(now);
          tokenCache.set(token, validTokens);
          resolve();
        }
      });
    },
  };
};

export const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique tokens per interval
});
